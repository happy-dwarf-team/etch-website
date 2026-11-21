// The loop controller (docs/spec.md, section 4; DESIGN.md, "Client JavaScript"), for every loop
// on the page, with the loop viewer, the section players and the demo loop's chapters. It works
// on top of the server-rendered HTML: without it the posters stay and no button shows.
//
// A loop plays only with no reduced-motion preference, without Save-Data and while at least half
// of it is in view in a visible tab; it pauses otherwise and resumes on return. Reduced motion and
// Save-Data leave the poster and a Play button. A refused play() stays on the poster; a source
// that fails to load leaves the poster and the description (the unavailable state).

type State = 'poster' | 'loading' | 'playing' | 'paused' | 'offscreen' | 'unavailable';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const saveData = () =>
	(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
const mayAutoplay = () => !reducedMotion.matches && !saveData();

/** What a section player swaps onto its stage for one feature. */
interface Clip {
	sources: { src: string; type: string }[];
	poster: string;
	width: string;
	height: string;
	/** The poster's alt, the video's aria-label. */
	label: string;
	/** What the buttons play, for screen readers: "the pick mode loop". */
	name: string;
	descriptionHtml: string;
}

// The loop viewer (LoopViewer.astro): one dialog for every loop, filled when it opens.
const viewer = document.querySelector<HTMLDialogElement>('[data-loop-viewer]');
const big = viewer?.querySelector('video');
const bigCaption = viewer?.querySelector('[data-loop-viewer-caption]');
let afterViewer: (() => void) | undefined;
if (viewer && big) {
	// Empties the viewer and gives the page back; once per opening, whatever closed it.
	const finish = () => {
		if (afterViewer === undefined) return;
		big.pause();
		big.replaceChildren();
		big.removeAttribute('poster');
		big.load();
		const after = afterViewer;
		afterViewer = undefined;
		after();
	};
	const closeViewer = () => {
		viewer.close();
		finish();
	};
	viewer.querySelector('[data-close]')?.addEventListener('click', closeViewer);
	// A click on the backdrop, outside the dialog's box, closes it too.
	viewer.addEventListener('click', (event) => {
		if (event.target === viewer) closeViewer();
	});
	// Esc closes the dialog itself; its close event does not reach every browser in time.
	viewer.addEventListener('cancel', () => setTimeout(finish, 0));
	viewer.addEventListener('close', finish);
}

class LoopControl {
	readonly video: HTMLVideoElement;
	private readonly figure: HTMLElement;
	private readonly toggle: HTMLButtonElement;
	private readonly enlarge: HTMLButtonElement | null;
	private readonly label: Element;
	private readonly description: Element | null;
	private inView = false;
	/** What the visitor asked for with Pause/Play or a chapter; null until they ask. */
	wants: 'play' | 'pause' | null = null;
	/** Whether the video has shown a frame other than the poster. */
	private started = false;
	private raf = 0;
	/** Called on every frame while the video plays, and after a seek or a swap. */
	readonly onTime: (() => void)[] = [];
	/** Called when the visitor presses Pause or opens the viewer: a section player stays. */
	onHold?: () => void;

	constructor(figure: HTMLElement, video: HTMLVideoElement, toggle: HTMLButtonElement) {
		this.figure = figure;
		this.video = video;
		this.toggle = toggle;
		this.enlarge = figure.querySelector<HTMLButtonElement>('[data-enlarge]');
		this.label = toggle.querySelector('.label')!;
		this.description = figure.querySelector('[data-description]');
		video.muted = true;

		toggle.addEventListener('click', () => {
			if (figure.dataset.playing !== undefined) {
				this.wants = 'pause';
				this.pause('paused');
				this.onHold?.();
			} else {
				this.wants = 'play';
				this.play();
			}
		});
		if (this.enlarge && viewer) {
			this.enlarge.hidden = false;
			this.enlarge.addEventListener('click', () => this.openViewer());
			video.addEventListener('click', () => this.openViewer());
		}

		this.watchSources();
		video.addEventListener('error', () => this.setState('unavailable'));
		// A loop that does not repeat stops on its last frame.
		video.addEventListener('ended', () => {
			if (!video.loop) this.setState('paused');
		});
		const frame = () => {
			this.tick();
			this.raf = video.paused || video.ended ? 0 : requestAnimationFrame(frame);
		};
		video.addEventListener('playing', () => {
			if (!this.raf) this.raf = requestAnimationFrame(frame);
		});
		for (const type of ['seeked', 'pause', 'emptied', 'loadedmetadata']) {
			video.addEventListener(type, () => this.tick());
		}

		new IntersectionObserver(
			([entry]) => {
				this.inView = entry.intersectionRatio >= 0.5;
				this.decide();
			},
			{ threshold: [0, 0.5, 1] },
		).observe(figure.querySelector('.media-box')!);

		this.setState('poster');
	}

	private tick() {
		for (const fn of this.onTime) fn();
	}

	// The last source's error means none could be played.
	private watchSources() {
		const sources = this.video.querySelectorAll('source');
		sources[sources.length - 1]?.addEventListener('error', () => this.setState('unavailable'));
	}

	private get state() {
		return this.figure.dataset.state as State;
	}

	private setState(state: State) {
		this.figure.dataset.state = state;
		const playing = state === 'playing' || state === 'loading';
		this.figure.toggleAttribute('data-playing', playing);
		this.label.textContent = playing ? 'Pause' : 'Play';
		this.toggle.hidden = state === 'unavailable';
	}

	play() {
		if (this.state === 'unavailable') return;
		this.setState(this.video.readyState >= 3 ? 'playing' : 'loading');
		this.video.play().then(
			() => {
				this.started = true;
				this.setState('playing');
			},
			(error: DOMException) => {
				// NotAllowedError: the browser refused playback; AbortError: pause() came first.
				if (error.name === 'NotAllowedError') this.setState(this.started ? 'paused' : 'poster');
				else if (error.name !== 'AbortError') this.setState('unavailable');
			},
		);
	}

	pause(state: State) {
		this.video.pause();
		if (this.state !== 'unavailable') this.setState(this.started ? state : 'poster');
	}

	decide() {
		if (this.state === 'unavailable') return;
		if (this.wants === 'pause' || (this.wants === null && !mayAutoplay())) this.pause('paused');
		else if (!this.inView || document.hidden) this.pause('offscreen');
		else if (this.video.paused) this.play();
	}

	// Seeks to a chapter's start and plays from there; under reduced motion or Save-Data it stays
	// on that frame with its Play button (section 4.2). The video loads nothing before it plays,
	// so a seek before that loads it first.
	seek(time: number) {
		const video = this.video;
		if (video.readyState >= 1) {
			video.currentTime = time;
		} else {
			video.addEventListener('loadedmetadata', () => (video.currentTime = time), { once: true });
			video.preload = 'auto';
			video.load();
		}
		this.started = true;
		this.wants = mayAutoplay() ? 'play' : 'pause';
		this.decide();
	}

	// Puts another feature's loop on the stage: its sources, poster, label and description. The
	// 16:9 box stays, so nothing moves; the poster loads only now.
	swap(clip: Clip) {
		const video = this.video;
		video.pause();
		video.replaceChildren(
			...clip.sources.map(({ src, type }) => {
				const source = document.createElement('source');
				source.src = src;
				source.type = type;
				return source;
			}),
		);
		video.poster = clip.poster;
		video.width = Number(clip.width);
		video.height = Number(clip.height);
		video.setAttribute('aria-label', clip.label);
		if (this.description) this.description.innerHTML = clip.descriptionHtml;
		for (const name of this.figure.querySelectorAll('[data-name]')) name.textContent = ` ${clip.name}`;
		this.watchSources();
		this.started = false;
		video.load();
		this.setState('poster');
		this.tick();
	}

	// Shows the loop large: the small one pauses, and plays on (as the rules allow) after.
	private openViewer() {
		if (!viewer || !big || !bigCaption || this.state === 'unavailable') return;
		big.replaceChildren(...[...this.video.querySelectorAll('source')].map((s) => s.cloneNode()));
		big.poster = this.video.poster;
		big.setAttribute('aria-label', this.video.getAttribute('aria-label') ?? '');
		bigCaption.innerHTML = this.description?.innerHTML ?? '';
		this.pause('paused');
		this.onHold?.();
		// The focus goes back to this loop's Enlarge, whether it or the video opened the viewer.
		afterViewer = () => {
			this.enlarge?.focus({ preventScroll: true });
			this.decide();
		};
		viewer.showModal();
		big.load();
		if (mayAutoplay()) void big.play().catch(() => undefined);
	}
}

const loops = new Map<HTMLElement, LoopControl>();
for (const figure of document.querySelectorAll<HTMLElement>('[data-loop]')) {
	const video = figure.querySelector('video');
	const toggle = figure.querySelector<HTMLButtonElement>('[data-toggle]');
	if (video && toggle) loops.set(figure, new LoopControl(figure, video, toggle));
}
const decideAll = () => loops.forEach((loop) => loop.decide());
document.addEventListener('visibilitychange', decideAll);
reducedMotion.addEventListener('change', decideAll);

// The demo loop's chapters (section 4.2; DESIGN.md, "Demo loop's chapters"): a click seeks to
// the chapter; the playing chapter is aria-current, and its bar fills while it plays.
for (const [figure, loop] of loops) {
	const row = figure.querySelector<HTMLElement>('[data-chapters]');
	if (!row) continue;
	const buttons = [...row.querySelectorAll<HTMLButtonElement>('button[data-start]')];
	const starts = buttons.map((b) => Number(b.dataset.start));
	const ends = [...starts.slice(1), Number(row.dataset.duration)];
	const fills = buttons.map((b) => b.querySelector<HTMLElement>('.fill'));
	let current = 0;
	loop.onTime.push(() => {
		const time = loop.video.currentTime;
		let k = 0;
		while (k + 1 < starts.length && starts[k + 1] <= time + 0.05) k++;
		if (k !== current) {
			buttons[current].removeAttribute('aria-current');
			buttons[k].setAttribute('aria-current', 'true');
			current = k;
		}
		fills.forEach((fill, i) => {
			const part = i === k ? (time - starts[i]) / (ends[i] - starts[i]) : 0;
			if (fill) fill.style.transform = `scaleX(${Math.min(1, Math.max(0, part))})`;
		});
	});
	buttons.forEach((button, i) => button.addEventListener('click', () => loop.seek(starts[i])));
	row.hidden = false;
}

// The section players (section 4.1; DESIGN.md, "Section player"): a numbered disclosure list
// beside one stage. While the stage plays, the player moves on to the next feature when a loop
// ends, and the list follows; once the visitor picks a feature, presses Pause or opens the viewer
// it stays on that feature and repeats it. Under reduced motion or Save-Data it never moves on
// by itself.
for (const player of document.querySelectorAll<HTMLElement>('[data-section-player]')) {
	const figure = player.querySelector<HTMLElement>('[data-loop]');
	const loop = figure && loops.get(figure);
	if (!figure || !loop) continue;
	const items = [...player.querySelectorAll<HTMLElement>('[data-feature]')];
	const fills = items.map((item) => item.querySelector<HTMLElement>('.progress .fill'));

	// Each feature's heading becomes the button that selects it.
	const buttons = items.map((item) => {
		const heading = item.querySelector('[data-feature-heading]')!;
		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'feature-button';
		button.setAttribute('aria-controls', figure.id);
		button.append(...heading.childNodes);
		heading.append(button);
		return button;
	});

	const clipOf = (item: HTMLElement): Clip => ({
		sources: JSON.parse(item.dataset.sources ?? '[]') as Clip['sources'],
		poster: item.dataset.poster ?? '',
		width: item.dataset.width ?? '',
		height: item.dataset.height ?? '',
		label: item.dataset.label ?? '',
		name: item.dataset.name ?? '',
		descriptionHtml: item.querySelector('template')?.innerHTML ?? '',
	});

	let index = 0;
	let stays = false;
	const stay = () => {
		stays = true;
		loop.video.loop = true;
	};

	const select = (k: number) => {
		index = k;
		items.forEach((item, i) => {
			const on = i === k;
			buttons[i].setAttribute('aria-expanded', String(on));
			item.toggleAttribute('data-selected', on);
			item.querySelector<HTMLElement>('[data-feature-text]')!.hidden = !on;
		});
	};

	loop.onTime.push(() => {
		const { currentTime, duration } = loop.video;
		const part = duration > 0 ? currentTime / duration : 0;
		fills.forEach((fill, i) => {
			if (fill) fill.style.transform = `scaleX(${i === index ? Math.min(1, part) : 0})`;
		});
	});

	buttons.forEach((button, k) =>
		button.addEventListener('click', () => {
			stay();
			loop.wants = null;
			if (k !== index) {
				select(k);
				loop.swap(clipOf(items[k]));
			}
			loop.decide();
		}),
	);
	loop.onHold = stay;
	loop.video.addEventListener('ended', () => {
		if (stays) return;
		select((index + 1) % items.length);
		loop.swap(clipOf(items[index]));
		loop.decide();
	});

	if (!mayAutoplay()) stay();
	reducedMotion.addEventListener('change', () => {
		if (!mayAutoplay()) stay();
	});
	select(0);
	player.dataset.ready = '';
}
