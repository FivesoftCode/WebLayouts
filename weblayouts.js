window.addEventListener('load', () => {
    let bodies = document.querySelectorAll('body')
    for (let body of bodies) {
        body.style.margin = '0'
        body.style.padding = '0'
        body.style.width = '100vw'
        body.style.height = '100vh'
    }

    let wlStyles = document.createElement('style')

    wlStyles.innerHTML = `
        ._wlfno {
            -webkit-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        ._wlfsel {
            -webkit-user-select: text;
            -ms-user-select: text;
            user-select: text;
            cursor: text;
        }

        ._wlfbtn {
            cursor: pointer;
        }
    `;

    document.head.appendChild(wlStyles)
});

/**
 * @private
*/
isString = value => typeof value === 'string' || value instanceof String;

class View extends HTMLElement {

    static ATTR_WIDTH = 'w';
    static ATTR_HEIGHT = 'h';
    static ATTR_BACKGROUND = 'bg';

    static ATTR_PADDING_LEFT = 'l-p';
    static ATTR_PADDING_RIGHT = 'r-p';
    static ATTR_PADDING_TOP = 't-p';
    static ATTR_PADDING_BOTTOM = 'b-t';
    static ATTR_PADDING_HORIZONTAL = 'h-p';
    static ATTR_PADDING_VERTICAL = 'v-p';
    static ATTR_PADDING = 'p';

    static ATTR_MAX_WIDTH = 'max-w';
    static ATTR_MAX_HEIGHT = 'max-h';
    static ATTR_MIN_WIDTH = 'min-w';
    static ATTR_MIN_HEIGHT = 'min-h';

    static ATTR_MIN_WINDOW_WIDTH = 'min-win-w';
    static ATTR_MIN_WINDOW_HEIGHT = 'min-win-h';

    static ATTR_MARGIN_LEFT = 'l-m';
    static ATTR_MARGIN_RIGHT = 'r-m';
    static ATTR_MARGIN_TOP = 't-m';
    static ATTR_MARGIN_BOTTOM = 'b-m';
    static ATTR_MARGIN_HORIZONTAL = 'h-m';
    static ATTR_MARGIN_VERTICAL = 'v-m';
    static ATTR_MARGIN = 'm';

    static ATTR_CORNER_RADIUS_TOP_LEFT = 'tl-cr';
    static ATTR_CORNER_RADIUS_TOP_RIGHT = 'tr-cr';
    static ATTR_CORNER_RADIUS_BOTTOM_LEFT = 'bl-cr';
    static ATTR_CORNER_RADIUS_BOTTOM_RIGHT = 'br-cr';
    static ATTR_CORNER_RADIUS_TOP = 't-cr';
    static ATTR_CORNER_RADIUS_BOTTOM = 'b-cr';
    static ATTR_CORNER_RADIUS_LEFT = 'l-cr';
    static ATTR_CORNER_RADIUS_RIGHT = 'r-cr';
    static ATTR_CORNER_RADIUS = 'cr';

    static ATTR_VISIBLE = 'visible'; //true or false
    static ATTR_ELEVATION = 'elev'; //size px, % etc

    static ATTR_LAYOUT_GRAVITY_HORIZONTAL = 'h-l-grav'; //start, center, end
    static ATTR_LAYOUT_GRAVITY_VERTICAL = 'v-l-grav'; //start, center, end
    static ATTR_LAYOUT_GRAVITY = 'l-grav'; //start, center, end
    static ATTR_FOCUS_MODE = 'f-mode'; //none, select, button

    static get observedAttributes() {
        return [
            this.ATTR_BACKGROUND,
            this.ATTR_WIDTH,
            this.ATTR_HEIGHT,
            this.ATTR_PADDING_LEFT,
            this.ATTR_PADDING_RIGHT,
            this.ATTR_PADDING_TOP,
            this.ATTR_PADDING_BOTTOM,
            this.ATTR_PADDING_HORIZONTAL,
            this.ATTR_PADDING_VERTICAL,
            this.ATTR_PADDING,
            this.ATTR_MARGIN_LEFT,
            this.ATTR_MARGIN_RIGHT,
            this.ATTR_MARGIN_TOP,
            this.ATTR_MARGIN_BOTTOM,
            this.ATTR_MARGIN_HORIZONTAL,
            this.ATTR_MARGIN_VERTICAL,
            this.ATTR_MARGIN,
            this.ATTR_MAX_WIDTH,
            this.ATTR_MAX_HEIGHT,
            this.ATTR_MIN_WIDTH,
            this.ATTR_MIN_HEIGHT,
            this.ATTR_MIN_WINDOW_WIDTH,
            this.ATTR_MIN_WINDOW_HEIGHT,
            this.ATTR_CORNER_RADIUS_TOP_LEFT,
            this.ATTR_CORNER_RADIUS_TOP_RIGHT,
            this.ATTR_CORNER_RADIUS_BOTTOM_LEFT,
            this.ATTR_CORNER_RADIUS_BOTTOM_RIGHT,
            this.ATTR_CORNER_RADIUS_TOP,
            this.ATTR_CORNER_RADIUS_BOTTOM,
            this.ATTR_CORNER_RADIUS_LEFT,
            this.ATTR_CORNER_RADIUS_RIGHT,
            this.ATTR_CORNER_RADIUS,
            this.ATTR_VISIBLE,
            this.ATTR_ELEVATION,
            this.ATTR_LAYOUT_GRAVITY_HORIZONTAL,
        ];
    }

    /**
     * @protected
     */

    static applyPaddings(el) {
        el.style.boxSizing = 'border-box';
        el.style.webkitBoxSizing = 'border-box';
        el.style.mozBoxSizing = 'border-box';

        let p = el.getAttribute(View.ATTR_PADDING);
        let gp = {
            left: p, right: p, top: p, bottom: p
        }

        let ph = el.getAttribute(View.ATTR_PADDING_HORIZONTAL);
        let pv = el.getAttribute(View.ATTR_PADDING_VERTICAL);

        if (ph) {
            gp.left = ph
            gp.right = ph
        }

        if (pv) {
            gp.top = pv
            gp.bottom = pv
        }

        let pl = el.getAttribute(View.ATTR_PADDING_LEFT);
        let pr = el.getAttribute(View.ATTR_PADDING_RIGHT);
        let pt = el.getAttribute(View.ATTR_PADDING_TOP);
        let pb = el.getAttribute(View.ATTR_PADDING_BOTTOM);

        if (pl) gp.left = pl
        if (pr) gp.right = pr
        if (pt) gp.top = pt
        if (pb) gp.bottom = pb

        el.style.paddingLeft = gp.left;
        el.style.paddingRight = gp.right;
        el.style.paddingTop = gp.top;
        el.style.paddingBottom = gp.bottom;

    }

    /**
     * @protected
     */
    static applySpacing(el) {
        //Min/Max width/height
        let minW = el.getAttribute(View.ATTR_MIN_WIDTH);
        let maxW = el.getAttribute(View.ATTR_MAX_WIDTH);
        let minH = el.getAttribute(View.ATTR_MIN_HEIGHT);
        let maxH = el.getAttribute(View.ATTR_MAX_HEIGHT);
        let minWW = el.getAttribute(View.ATTR_MIN_WINDOW_WIDTH);
        let minWH = el.getAttribute(View.ATTR_MIN_WINDOW_HEIGHT);
        let visible = el.getAttribute(View.ATTR_VISIBLE);

        if (visible == 'false' || minWW && window.innerWidth < parseInt(minWW) ||
            (minWH && window.innerHeight < parseInt(minWH))) {
            if (el.style.display == 'none') {
                return
            }
            let cs = window.getComputedStyle(el)
            el._wl_cached_display = cs.display
            el.style.display = 'none'
        } else {
            if (el._wl_cached_display) {
                el.style.display = el._wl_cached_display
                delete el._wl_cached_display
            }
        }

        el.style.maxWidth = maxW ? maxW : ''
        el.style.minWidth = minW ? minW : ''
        el.style.maxHeight = maxH ? maxH : ''
        el.style.minHeight = minH ? minH : ''
        View.applyPaddings(el)
        View.applyMargins(el)

    }

    /**
     * @protected
     */
    static applyMargins(el) {

        el.style.boxSizing = 'border-box';
        el.style.webkitBoxSizing = 'border-box';
        el.style.mozBoxSizing = 'border-box';

        let m = el.getAttribute(View.ATTR_MARGIN);
        let gm = {
            left: m, right: m, top: m, bottom: m
        }

        let mh = el.getAttribute(View.ATTR_MARGIN_HORIZONTAL);
        let mv = el.getAttribute(View.ATTR_MARGIN_VERTICAL);

        if (mh) {
            gm.left = mh
            gm.right = mh
        }

        if (mv) {
            gm.top = mv
            gm.bottom = mv
        }

        let ml = el.getAttribute(View.ATTR_MARGIN_LEFT);
        let mr = el.getAttribute(View.ATTR_MARGIN_RIGHT);
        let mt = el.getAttribute(View.ATTR_MARGIN_TOP);
        let mb = el.getAttribute(View.ATTR_MARGIN_BOTTOM);

        if (ml) gm.left = ml
        if (mr) gm.right = mr
        if (mt) gm.top = mt
        if (mb) gm.bottom = mb

        el.style.marginLeft = gm.left;
        el.style.marginRight = gm.right;
        el.style.marginTop = gm.top;
        el.style.marginBottom = gm.bottom;

        //Update view size
        let w = el.getAttribute(View.ATTR_WIDTH);
        let h = el.getAttribute(View.ATTR_HEIGHT);
        if (w && w.endsWith('%')) {
            el.style.width = `calc(${w} - ${gm.left} - ${gm.right})`
        } else {
            el.style.width = w
        }
        if (h && h.endsWith('%')) {
            el.style.height = `calc(${h} - ${gm.top} - ${gm.bottom})`
        } else {
            el.style.height = h
        }

    }

    /**
     * @protected
     */
    static applyCornerRadius(el) {
        let cr = el.getAttribute(View.ATTR_CORNER_RADIUS);
        let gcr = {
            topLeft: cr, topRight: cr, bottomLeft: cr, bottomRight: cr
        }

        let tcr = el.getAttribute(View.ATTR_CORNER_RADIUS_TOP);
        let bcr = el.getAttribute(View.ATTR_CORNER_RADIUS_BOTTOM);

        let tlcr = el.getAttribute(View.ATTR_CORNER_RADIUS_TOP_LEFT);
        let trcr = el.getAttribute(View.ATTR_CORNER_RADIUS_TOP_RIGHT);
        let blcr = el.getAttribute(View.ATTR_CORNER_RADIUS_BOTTOM_LEFT);
        let brcr = el.getAttribute(View.ATTR_CORNER_RADIUS_BOTTOM_RIGHT);

        if (tcr) {
            gcr.topLeft = tcr
            gcr.topRight = tcr
        }

        if (bcr) {
            gcr.bottomLeft = bcr
            gcr.bottomRight = bcr
        }

        if (tlcr) gcr.topLeft = tlcr
        if (trcr) gcr.topRight = trcr
        if (blcr) gcr.bottomLeft = blcr
        if (brcr) gcr.bottomRight = brcr

        el.style.borderTopLeftRadius = gcr.topLeft;
        el.style.borderTopRightRadius = gcr.topRight;
        el.style.borderBottomLeftRadius = gcr.bottomLeft;
        el.style.borderBottomRightRadius = gcr.bottomRight;
    }

    /**
     * @protected
     */

    static applyFocusMode(el) {

        let fm = el.getAttribute(View.ATTR_FOCUS_MODE);

        el.classList.remove('_wlfno')
        el.classList.remove('_wlfsel')
        el.classList.remove('_wlfbtn')

        if (fm == 'button') {
            el.classList.add('_wlfbtn')
        } else if (fm == 'select') {
            el.classList.add('_wlfsel')
        } else {
            el.classList.add('_wlfno')
        }

    }

    static applyElevation(el) {
        let sh = el.getAttribute(View.ATTR_ELEVATION);
        let boxShadow = `0 10px 16px 0 #00000033,0 6px 20px 0 #00000033`
        if (sh) {
            el.style.boxShadow = boxShadow;
        } else {
            el.style.boxShadow = '';
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case View.ATTR_BACKGROUND: {
                this.style.backgroundColor = newValue;
                break;
            }
            case View.ATTR_WIDTH: {
                this.style.width = newValue;
                break;
            }
            case View.ATTR_HEIGHT: {
                this.style.height = newValue;
                break;
            }
            case View.ATTR_ELEVATION: {
                View.applyElevation(this);
                break;
            }
            case View.ATTR_FOCUS_MODE: {
                View.applyFocusMode(this);
            }
            default: {
                View.applySpacing(this);
                View.applyCornerRadius(this);
                break;
            }
        }
    }

    get w() { return this.getAttribute(View.ATTR_WIDTH); }
    set w(value) { this.setAttribute(View.ATTR_WIDTH, value); }
    get h() { return this.getAttribute(View.ATTR_HEIGHT); }
    set h(value) { this.setAttribute(View.ATTR_HEIGHT, value); }
    get bg() { return this.getAttribute(View.ATTR_BACKGROUND); }
    set bg(value) { this.setAttribute(View.ATTR_BACKGROUND, value); }
    get lP() { return this.getAttribute(View.ATTR_PADDING_LEFT); }
    set lP(value) { this.setAttribute(View.ATTR_PADDING_LEFT, value); }
    get rP() { return this.getAttribute(View.ATTR_PADDING_RIGHT); }
    set rP(value) { this.setAttribute(View.ATTR_PADDING_RIGHT, value); }
    get tP() { return this.getAttribute(View.ATTR_PADDING_TOP); }
    set tP(value) { this.setAttribute(View.ATTR_PADDING_TOP, value); }
    get bP() { return this.getAttribute(View.ATTR_PADDING_BOTTOM); }
    set bP(value) { this.setAttribute(View.ATTR_PADDING_BOTTOM, value); }
    get hP() { return this.getAttribute(View.ATTR_PADDING_HORIZONTAL); }
    set hP(value) { this.setAttribute(View.ATTR_PADDING_HORIZONTAL, value); }
    get vP() { return this.getAttribute(View.ATTR_PADDING_VERTICAL); }
    set vP(value) { this.setAttribute(View.ATTR_PADDING_VERTICAL, value); }
    get p() { return this.getAttribute(View.ATTR_PADDING); }
    set p(value) { this.setAttribute(View.ATTR_PADDING, value); }
    get lM() { return this.getAttribute(View.ATTR_MARGIN_LEFT); }
    set lM(value) { this.setAttribute(View.ATTR_MARGIN_LEFT, value); }
    get rM() { return this.getAttribute(View.ATTR_MARGIN_RIGHT); }
    set rM(value) { this.setAttribute(View.ATTR_MARGIN_RIGHT, value); }
    get tM() { return this.getAttribute(View.ATTR_MARGIN_TOP); }
    set tM(value) { this.setAttribute(View.ATTR_MARGIN_TOP, value); }
    get bM() { return this.getAttribute(View.ATTR_MARGIN_BOTTOM); }
    set bM(value) { this.setAttribute(View.ATTR_MARGIN_BOTTOM, value); }
    get hM() { return this.getAttribute(View.ATTR_MARGIN_HORIZONTAL); }
    set hM(value) { this.setAttribute(View.ATTR_MARGIN_HORIZONTAL, value); }
    get vM() { return this.getAttribute(View.ATTR_MARGIN_VERTICAL); }
    set vM(value) { this.setAttribute(View.ATTR_MARGIN_VERTICAL, value); }
    get m() { return this.getAttribute(View.ATTR_MARGIN); }
    set m(value) { this.setAttribute(View.ATTR_MARGIN, value); }
    get maxW() { return this.getAttribute(View.ATTR_MAX_WIDTH); }
    set maxW(value) { this.setAttribute(View.ATTR_MAX_WIDTH, value); }
    get maxH() { return this.getAttribute(View.ATTR_MAX_HEIGHT); }
    set maxH(value) { this.setAttribute(View.ATTR_MAX_HEIGHT, value); }
    get minW() { return this.getAttribute(View.ATTR_MIN_WIDTH); }
    set minW(value) { this.setAttribute(View.ATTR_MIN_WIDTH, value); }
    get minH() { return this.getAttribute(View.ATTR_MIN_HEIGHT); }
    set minH(value) { this.setAttribute(View.ATTR_MIN_HEIGHT, value); }
    get minWinW() { return this.getAttribute(View.ATTR_MIN_WINDOW_WIDTH); }
    set minWinW(value) { this.setAttribute(View.ATTR_MIN_WINDOW_WIDTH, value); }
    get minWinH() { return this.getAttribute(View.ATTR_MIN_WINDOW_HEIGHT); }
    set minWinH(value) { this.setAttribute(View.ATTR_MIN_WINDOW_HEIGHT, value); }
    get tlCR() { return this.getAttribute(View.ATTR_CORNER_RADIUS_TOP_LEFT); }
    set tlCR(value) { this.setAttribute(View.ATTR_CORNER_RADIUS_TOP_LEFT, value); }
    get trCR() { return this.getAttribute(View.ATTR_CORNER_RADIUS_TOP_RIGHT); }
    set trCR(value) { this.setAttribute(View.ATTR_CORNER_RADIUS_TOP_RIGHT, value); }
    get blCR() { return this.getAttribute(View.ATTR_CORNER_RADIUS_BOTTOM_LEFT); }
    set blCR(value) { this.setAttribute(View.ATTR_CORNER_RADIUS_BOTTOM_LEFT, value); }
    get brCR() { return this.getAttribute(View.ATTR_CORNER_RADIUS_BOTTOM_RIGHT); }
    set brCR(value) { this.setAttribute(View.ATTR_CORNER_RADIUS_BOTTOM_RIGHT, value); }
    get tCR() { return this.getAttribute(View.ATTR_CORNER_RADIUS_TOP); }
    set tCR(value) { this.setAttribute(View.ATTR_CORNER_RADIUS_TOP, value); }
    get bCR() { return this.getAttribute(View.ATTR_CORNER_RADIUS_BOTTOM); }
    set bCR(value) { this.setAttribute(View.ATTR_CORNER_RADIUS_BOTTOM, value); }
    get lCR() { return this.getAttribute(View.ATTR_CORNER_RADIUS_LEFT); }
    set lCR(value) { this.setAttribute(View.ATTR_CORNER_RADIUS_LEFT, value); }
    get rCR() { return this.getAttribute(View.ATTR_CORNER_RADIUS_RIGHT); }
    set rCR(value) { this.setAttribute(View.ATTR_CORNER_RADIUS_RIGHT, value); }
    get cr() { return this.getAttribute(View.ATTR_CORNER_RADIUS); }
    set cr(value) { this.setAttribute(View.ATTR_CORNER_RADIUS, value); }
    get visible() { return this.getAttribute(View.ATTR_VISIBLE); }
    set visible(value) { this.setAttribute(View.ATTR_VISIBLE, value); }
    get elev() { return this.getAttribute(View.ATTR_ELEVATION); }
    set elev(value) { this.setAttribute(View.ATTR_ELEVATION, value); }
    get vLGrav() { return this.getAttribute(FreeBox.ATTR_LAYOUT_GRAVITY_VERTICAL); }
    set vLGrav(value) { this.setAttribute(FreeBox.ATTR_LAYOUT_GRAVITY_VERTICAL, value); }
    get hLGrav() { return this.getAttribute(FreeBox.ATTR_LAYOUT_GRAVITY_HORIZONTAL); }
    set hLGrav(value) { this.setAttribute(FreeBox.ATTR_LAYOUT_GRAVITY_HORIZONTAL, value); }
    get lGrav() { return this.getAttribute(FreeBox.ATTR_LAYOUT_GRAVITY); }
    set lGrav(value) { this.setAttribute(FreeBox.ATTR_LAYOUT_GRAVITY, value); }
    get fMode() { return this.getAttribute(View.ATTR_FOCUS_MODE); }
    set fMode(value) { this.setAttribute(View.ATTR_FOCUS_MODE, value); }

    constructor() { super(); }

    connectedCallback() {
        this.style.width = this.width;
        this.style.height = this.height;
        this.style.backgroundColor = this.bg;
        this.style.display = 'block';
        this.style.position = 'relative';
        View.applySpacing(this);
        View.applyCornerRadius(this);
        View.applyFocusMode(this);
    }

    disconnectedCallback() {
    }

    /**
     * @override
     */

    setAttribute(name, value) {
        if (value == null || value == undefined) {
            this.removeAttribute(name)
        } else {
            super.setAttribute(name, value);
        }
    }

}

class ViewGroup extends View {

    constructor() {
        super();
    }

    static applyAutoSize(el) {

        //Compute max child width and height
        let maxW = 0
        let maxH = 0

        for (let child of el.children) {
            let cw = child.clientWidth
            let ch = child.clientHeight

            if (cw > maxW) maxW = cw
            if (ch > maxH) maxH = ch
        }

        if (el.w == 'auto') {
            console.log('maxW: ' + maxW)
            el.style.width = `${maxW}px`
        }

        if (el.h == 'auto') {
            console.log('maxH: ' + maxH)
            el.style.height = `${maxH}px`
        }

    }

    /**
     * @private
     */
    observer = new ResizeObserver((entries) => {
        this.requestLayout();
    });

    /**
     * @private
     */

    observer2 = new MutationObserver((mutations) => {
        if (mutations.length > 0) {
            this.requestLayout();
        }
    });

    /**
     * @private
     */
    s = {
        layoutRunning: false
    }

    connectedCallback() {
        this.observer.observe(this);
        this.observer2.observe(this,
            {
                childList: true, subtree: true, attributes: true,
                attributeFilter: ['visible']
            });
        super.connectedCallback();
        this.requestLayout();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.observer.disconnect();
        this.observer2.disconnect();
    }

    requestLayout() {
        if (this.s.layoutRunning) return;
        this.s.layoutRunning = true;
        this.layoutChildren();
        this.s.layoutRunning = false;
    }

    /**
     * @protected
     */
    layoutChildren() {
        for (let child of this.children) {
            View.applySpacing(child);
            View.applyCornerRadius(child);
            View.applyElevation(child);
            View.applyFocusMode(child);

            //apply background
            let bg = child.getAttribute(View.ATTR_BACKGROUND);
            if (bg) {
                child.style.backgroundColor = bg;
            }
        }
    }

}

class LinearBox extends ViewGroup {

    static ATTR_ORIENTATION = 'orientation';
    static ATTR_GRAVITY_HORIZONTAL = 'h-grav';
    static ATTR_GRAVITY_VERTICAL = 'v-grav';
    static ATTR_GRAVITY = 'grav';
    static ATTR_SCROLL = 'scroll'; //vertical, horizontal, both, none
    static ATTR_STICKY = 'sticky'; //true or false
    static AUTO_WRAP = 'auto-wrap'; //true or false

    static get observedAttributes() {
        return super.observedAttributes.concat([
            this.ATTR_ORIENTATION,
            this.ATTR_GRAVITY,
            this.ATTR_GRAVITY_HORIZONTAL,
            this.ATTR_GRAVITY_VERTICAL,
            this.ATTR_SCROLL,
            this.ATTR_STICKY
        ]);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            case LinearBox.ATTR_ORIENTATION: {
                this.requestLayout();
                break;
            }
            case LinearBox.ATTR_GRAVITY: {
                this.requestLayout();
                break;
            }
            case LinearBox.ATTR_GRAVITY_HORIZONTAL: {
                this.requestLayout();
                break;
            }
            case LinearBox.ATTR_GRAVITY_VERTICAL: {
                this.requestLayout();
                break;
            }
            case LinearBox.ATTR_SCROLL: {
                this.applyScroll()
                break;
            }
            case LinearBox.ATTR_STICKY: {
                this.requestLayout()
                console.log('sticky changed to ' + newValue)
                break;
            }
        }
    }

    get orientation() {
        return this.getAttribute(LinearBox.ATTR_ORIENTATION);
    }

    set orientation(value) {
        this.setAttribute(LinearBox.ATTR_ORIENTATION, value);
    }

    get scroll() {
        return this.getAttribute(LinearBox.ATTR_SCROLL);
    }

    set scroll(value) {
        this.setAttribute(LinearBox.ATTR_SCROLL, value);
    }

    /**
     * Gravity of the 2 axis. "start", "center" or "end"
     */

    get gravity() {
        return this.getAttribute(LinearBox.ATTR_GRAVITY);
    }

    /**
     * Sets gravity of both axis to the same value.
     * for example "start" will align the children to the top-left corner
     * @param {string} value must be one of the following: start, center, end
     */

    set gravity(value) {
        this.setAttribute(LinearBox.ATTR_GRAVITY, value);
    }

    /**
     * Gravity of the horizontal axis. "start", "center" or "end"
     */

    get hGravity() {
        return this.getAttribute(LinearBox.ATTR_GRAVITY_HORIZONTAL);
    }

    /**
     * Sets gravity of the horizontal axis.
     * @param {string} value must be one of the following: start, center, end
     */

    set hGravity(value) {
        this.setAttribute(LinearBox.ATTR_GRAVITY_HORIZONTAL, value);
    }

    get vGravity() {
        return this.getAttribute(LinearBox.ATTR_GRAVITY_VERTICAL);
    }

    set vGravity(value) {
        this.setAttribute(LinearBox.ATTR_GRAVITY_VERTICAL, value);
    }

    constructor() {
        super();
        // Your custom element initialization code goes here
    }

    /**
     * @override
     * @protected
     */

    layoutChildren() {
        super.layoutChildren();
        var hor = this.orientation == 'horizontal'
        this.setupParent(this, hor)
        let i = 0;
        let overflow = this.scroll == 'vertical'
            || this.scroll == 'horizontal'
            || this.scroll == 'both'
        for (let child of this.children) {
            this.setupChild(child, hor)
            let w = child.getAttribute(View.ATTR_WIDTH);
            let h = child.getAttribute(View.ATTR_HEIGHT);

            let s = hor ? w : h
            if ((!s || s == 'auto' || !s.endsWith('%'))) {
                //Must be set to correctly 
                //work when overflow is on, don't know why
                child.style.flexShrink = 0
            } else {
                child.style.flexShrink = ''
            }
            i++
        }
    }

    applyScroll() {
        if (this.scroll == 'vertical') {
            this.style.overflowY = 'auto'
        } else if (this.scroll == 'horizontal') {
            this.style.overflowX = 'auto'
        } else if (this.scroll == 'both') {
            this.style.overflow = 'auto'
        } else {
            this.style.overflow = 'hidden'
        }
    }

    setupParent(el, h) {
        const gv = this.vGravity ? this.vGravity : this.gravity
        const gh = this.hGravity ? this.hGravity : this.gravity
        let visible = el.getAttribute(View.ATTR_VISIBLE);
        let minWW = el.getAttribute(View.ATTR_MIN_WINDOW_WIDTH);
        let minWH = el.getAttribute(View.ATTR_MIN_WINDOW_HEIGHT);

        if (visible == 'false' || minWW && window.innerWidth < parseInt(minWW) ||
            (minWH && window.innerHeight < parseInt(minWH))) {
            el._wl_cached_display = 'flex'
            el.style.display = 'none'
            return
        }

        el.style.display = 'flex'
        el.style.flexWrap = el.getAttribute(LinearBox.AUTO_WRAP) == 'true' ? 'wrap' : 'nowrap'

        if (h) {
            el.style.flexDirection = 'row'
        } else {
            el.style.flexDirection = 'column'
        }

        if (gh) {
            if (h) {
                el.style.justifyContent = gh == 'end' ? 'right' : gh == 'center' ? 'center' : 'left'
            } else {
                el.style.alignItems = gh
            }
        } else {
            if (h) {
                el.style.justifyContent = 'left'
            } else {
                el.style.alignItems = 'start'
            }
        }

        if (gv) {
            if (h) {
                el.style.alignItems = gv
            } else {
                el.style.justifyContent = gv == 'end' ? 'end' : gv == 'center' ? 'center' : 'start'
            }
        } else {
            if (h) {
                el.style.alignItems = 'start'
            } else {
                el.style.justifyContent = 'start'
            }
        }

    }

    setupChild(el, h) {
        let sticky = el.getAttribute(LinearBox.ATTR_STICKY)
        if (sticky === 'true') {
            el._wl_cached_position = el.style.position
            el.style.position = 'sticky'
            el.style.top = '0'
            el.style.left = '0'
            el.style.zIndex = '1'
        } else {
            if (el._wl_cached_position) {
                el.style.position = el._wl_cached_position
                delete el._wl_cached_position
            }
            el.style.top = ''
            el.style.left = ''
            el.style.zIndex = ''
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this.applyScroll()
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        // Clean up when the element is removed from the DOM
    }

}

class FreeBox extends ViewGroup {

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        // Clean up when the element is removed from the DOM
    }

    /**
     * @override
     */
    layoutChildren() {
        super.layoutChildren();
        this.style.overflow = 'hidden'

        ViewGroup.applyAutoSize(this)

        for (let child of this.children) {
            this.layoutChild(child)
        }
    }

    layoutChild(el) {
        el.style.position = 'absolute'

        let avlg = el.getAttribute(View.ATTR_LAYOUT_GRAVITY_VERTICAL);
        let ahlg = el.getAttribute(View.ATTR_LAYOUT_GRAVITY_HORIZONTAL);
        let alg = el.getAttribute(View.ATTR_LAYOUT_GRAVITY);
        let minWidth = el.getAttribute(View.ATTR_MIN_WIDTH);
        let minHeight = el.getAttribute(View.ATTR_MIN_HEIGHT);

        let gv = avlg ? avlg : alg ? alg : 'start'
        let gh = ahlg ? ahlg : alg ? alg : 'start'

        let pw = this.clientWidth
        let ph = this.clientHeight

        let cs = window.getComputedStyle(el)

        let ml = cs.marginLeft ? cs.marginLeft : '0px'
        let mr = cs.marginRight ? cs.marginRight : '0px'
        let mt = cs.marginTop ? cs.marginTop : '0px'
        let mb = cs.marginBottom ? cs.marginBottom : '0px'

        el.style.maxWidth = `calc(min(${pw}px - ${ml} - ${mr}, ${minWidth}))`
        el.style.maxHeight = `calc(min(${ph}px - ${mt} - ${mb}, ${minHeight}))`

        let cw = el.clientWidth
        let ch = el.clientHeight

        if (gh == 'end') {
            el.style.right = '0'
            el.style.left = ''
        } else if (gh == 'center') {
            let pxw = pw / 2 - cw / 2
            el.style.left = `calc(${pxw}px - ${ml})`
        } else if (gh.endsWith('px')) {
            //Anchor to the specified pixel
            let x = parseInt(gh)
            if (x < pw / 2) {
                //Anchor to the left corner
                el.style.left = `calc(max(0px, min(${gh}, ${pw - cw}px - ${ml} - ${mr}) ))`
                el.style.right = ''
            } else {
                //Anchor to the right corner
                el.style.left = ''
                el.style.right = `calc(max(0px, min(${pw}px - ${x}px, ${pw - cw}px - ${ml} - ${mr})))`
            }
        } else {
            el.style.left = '0'
            el.style.right = ''
        }

        if (gv == 'end') {
            el.style.bottom = '0'
            el.style.top = ''
        } else if (gv == 'center') {
            let pyh = ph / 2 - ch / 2
            el.style.top = `calc(${pyh}px - ${mt})`
        } else if (gv.endsWith('px')) {
            //Anchor to the specified pixel
            let y = parseInt(gv)
            if (y < ph / 2) {
                //Anchor to the top corner
                el.style.top = `calc(max(0px, min(${gv}, ${ph - ch}px - ${mt} - ${mb}) ))`
                el.style.bottom = ''
            } else {
                //Anchor to the bottom corner
                el.style.top = ''
                el.style.bottom = `calc(max(0px, min(${ph}px - ${y}px, ${ph - ch}px - ${mt} - ${mb})))`
            }
        } else {
            el.style.top = '0'
            el.style.bottom = ''
        }

    }

}

class BoundBox extends ViewGroup {

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.style.overflow = 'hidden'
    }

    layoutChildren() {
        super.layoutChildren();

        for (let child of this.children) {
            child.style.position = 'absolute'
            child.style.top = '0'
            child.style.left = '0'
            child.style.width = '100%'
            child.style.height = '100%'
            child.style.margin = '0'
        }

        ViewGroup.applyAutoSize(this)
    }

}

class VerticalBox extends LinearBox {

    constructor() {
        super();
    }

    connectedCallback() {
        this.orientation = 'vertical'
        super.connectedCallback();
    }

}

class HorizontalBox extends LinearBox {

    constructor() {
        super();
    }

    connectedCallback() {
        this.orientation = 'horizontal'
        super.connectedCallback();
    }

}

class ModalContainer extends BoundBox {

    static ATTR_MODAL_CORNER_RADIUS = 'modal-cr';
    static ATTR_MODAL_BACKGROUND = 'modal-bg';
    static ATTR_MODAL_ELEVATION = 'modal-elev';
    static ATTR_CONTAINER_BG_MODE = 'cont-bg-mode'; //none, blur, dim
    static ATTR_CONTAIONER_TRANSITION_DURATION = 'cont-transition-duration';

    static get observedAttributes() {
        return super.observedAttributes.concat([
            this.ATTR_MODAL_CORNER_RADIUS,
            this.ATTR_MODAL_BACKGROUND,
            this.ATTR_MODAL_ELEVATION,
            this.ATTR_CONTAINER_BG_MODE,
            this.ATTR_CONTAIONER_TRANSITION_DURATION
        ]);
    }

    connectedCallback() {
        super.connectedCallback();
        this.style.pointerEvents = 'none'
    }

    show(id, html, options) {
        let cancelable = options.cancelable != false //default true

        let w = options.w ? options.w : '80%'
        let h = options.h ? options.h : '80%'

        let modal = this.createModal(html, w, h, options.grav, options.m)
        modal._wl_mc_id = id

        if (cancelable) {
            modal.addEventListener('click', (ev) => {
                ev.stopPropagation()
                this.dismiss(id)
            })
        }

        if (this.findChildByMCID(id)) {
            if (this.children.length == 0) {
                this.style.pointerEvents = 'none'
            }
            return //already exists
        }

        this.appendChild(modal)
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.style.pointerEvents = 'all';
        }, 10);
    }

    dismiss(id) {
        let child = this.findChildByMCID(id)
        let transDur = this.getAttribute(ModalContainer.ATTR_CONTAIONER_TRANSITION_DURATION)
        if (!transDur || isNaN(transDur)) transDur = 300
        if (child && child.child) {
            let cr = [];
            for (let i = child.index; i < this.children.length; i++) {
                let c = this.children[i]
                c.style.opacity = '0';
                c.style.pointerEvents = 'none';
                cr.push(c)
            }
            setTimeout(() => {
                for (let c of cr) {
                    this.removeChild(c)
                }
                if (this.children.length == 0) {
                    this.style.pointerEvents = 'none'
                }
            }, transDur);
        }
    }

    dismissAll() {
        let transTime = this.getAttribute(ModalContainer.ATTR_CONTAIONER_TRANSITION_DURATION)
        if (isNaN(transTime)) {
            transTime = 300 //default
        }
        for (child of this.children) {
            child.style.opacity = '0';
            child.style.pointerEvents = 'none';
        }
        setTimeout(() => { this.innerHTML = '' }, transTime);
        this.style.pointerEvents = 'none'
    }

    /**
     * @private
     */

    findChildByMCID(id) {
        let i = 0
        for (let child of this.children) {
            if (child._wl_mc_id === id) {
                return {
                    child: child,
                    index: i
                }
            }
            i++
        }
        return null
    }

    /**
     * @private
     */

    createModal(html, width, height, grav, m) {
        let transDur = this.getAttribute(ModalContainer.ATTR_CONTAIONER_TRANSITION_DURATION)
        let modalBg = this.getAttribute(ModalContainer.ATTR_MODAL_BACKGROUND)
        let modalCR = this.getAttribute(ModalContainer.ATTR_MODAL_CORNER_RADIUS)
        let modalElev = this.getAttribute(ModalContainer.ATTR_MODAL_ELEVATION)
        let modalBgMode = this.getAttribute(ModalContainer.ATTR_CONTAINER_BG_MODE)

        if (!transDur || isNaN(transDur)) transDur = 300
        if (!modalBg) modalBg = 'white'
        if (!modalCR) modalCR = '5px'
        if (!modalElev) modalElev = '1'
        if (!modalBgMode) modalBgMode = 'blur'

        let mbg = document.createElement('f-box')
        mbg.w = '100%'
        mbg.h = '100%'

        if (modalBgMode == 'blur') {
            mbg.style.backdropFilter = 'blur(5px)';
            mbg.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
        } else if (modalBgMode == 'dim') {
            mbg.style.backdropFilter = 'none';
            mbg.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
        } else {
            mbg.style.backdropFilter = 'none';
            mbg.style.backgroundColor = 'transparent';
        }

        mbg.style.opacity = '0';
        mbg.style.transition = `opacity ${transDur}ms ease-in-out`;

        let modal = document.createElement('b-box')
        modal.w = width
        modal.h = height
        modal.bg = modalBg
        modal.cr = modalCR
        modal.elev = modalElev
        if (isString(html)) {
            modal.innerHTML = html
        } else {
            modal.innerHTML = ''
            modal.appendChild(html)
        }

        modal.style.pointerEvents = 'all'
        modal.onclick = (ev) => { ev.stopPropagation() }

        //Apply gravity
        if (grav) {
            if (isString(grav)) {
                modal.lGrav = grav
            } else {
                if (grav.v) {
                    modal.vLGrav = grav.v
                }
                if (grav.h) {
                    modal.hLGrav = grav.h
                }
            }
        } else {
            modal.lGrav = 'center'
        }

        //Apply margins
        if (m) {
            if (isString(m)) {
                modal.m = m
            } else {
                modal.m = "4%" //default
                if (m.l) {
                    modal.lM = m.l
                }
                if (m.r) {
                    modal.rM = m.r
                }
                if (m.t) {
                    modal.tM = m.t
                }
                if (m.b) {
                    modal.bM = m.b
                }
            }
        } else {
            modal.m = "4%" //default
        }

        mbg.appendChild(modal)

        return mbg
    }

}

class ContentBox extends BoundBox {

    static ATTR_SRC = 'src';

    /**
     * @private
     */

    iframe = null;

    static get observedAttributes() {
        return super.observedAttributes.concat([
            this.ATTR_SRC
        ]);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            case ContentBox.ATTR_SRC: {
                this.loadContent();
                break;
            }
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this.iframe = document.createElement('iframe')
        this.iframe.frameBorder = '0'
        this.innerHTML = ''
        this.appendChild(this.iframe)
        this.loadContent()
    }

    /**
     * @private
     */

    async loadContent() {
        let src = this.getAttribute(ContentBox.ATTR_SRC)

        if (!this.iframe) return

        if (src) {
            this.iframe.src = src
        } else {
            this.iframe.src = ''
        }
    }

}

class IconButton {

    constructor(icon, onClick) {
        this.icon = icon
        this.onClick = onClick
    }

}

class IconTextButton extends IconButton {

    constructor(text, icon, onClick) {
        super(icon, onClick)
        this.text = text
    }

}

class DialogHeader extends HorizontalBox {

    static ATTR_TITLE = 'title';
    static ATTR_TITLE_GRAVITY = 'title-grav';
    static ATTR_BUTTON_BACK = 'btn-back';
    static ATTR_BUTTON_BACK_ON_CLICK = 'btn-back-on-click';
    static ATTR_BUTTON_CLOSE = 'btn-close';
    static ATTR_BUTTON_CLOSE_ON_CLICK = 'btn-close-on-click';

    static get observedAttributes() {
        return super.observedAttributes.concat([
            this.ATTR_TITLE,
            this.ATTR_TITLE_GRAVITY,
            this.ATTR_BUTTON_BACK,
            this.ATTR_BUTTON_BACK_ON_CLICK,
            this.ATTR_BUTTON_CLOSE,
            this.ATTR_BUTTON_CLOSE_ON_CLICK
        ]);
    }

    constructor() {
        super();
    }

    get title() { return this.getAttribute(DialogHeader.ATTR_TITLE); }
    set title(value) { this.setAttribute(DialogHeader.ATTR_TITLE, value); }
    get titleGravity() { return this.getAttribute(DialogHeader.ATTR_TITLE_GRAVITY); }
    set titleGravity(value) { this.setAttribute(DialogHeader.ATTR_TITLE_GRAVITY, value); }

    get buttonBack() {
        return new IconButton(
            this.getAttribute(DialogHeader.ATTR_BUTTON_BACK),
            this.getAttribute(DialogHeader.ATTR_BUTTON_BACK_ON_CLICK)
        );
    }
    set buttonBack(value) {

        if (value) {
            this.setAttribute(DialogHeader.ATTR_BUTTON_BACK_ON_CLICK, value.onClick);
            this.setAttribute(DialogHeader.ATTR_BUTTON_BACK, value.icon);
        } else {
            delete this.attributes[DialogHeader.ATTR_BUTTON_BACK_ON_CLICK]
            delete this.attributes[DialogHeader.ATTR_BUTTON_BACK]
        }
    }
    get buttonClose() {
        return new IconButton(
            this.getAttribute(DialogHeader.ATTR_BUTTON_CLOSE),
            this.getAttribute(DialogHeader.ATTR_BUTTON_CLOSE_ON_CLICK)
        );
    }
    set buttonClose(value) {
        if (value) {
            this.setAttribute(DialogHeader.ATTR_BUTTON_CLOSE_ON_CLICK, value.onClick);
            this.setAttribute(DialogHeader.ATTR_BUTTON_CLOSE, value.icon);
        } else {
            delete this.attributes[DialogHeader.ATTR_BUTTON_CLOSE_ON_CLICK]
            delete this.attributes[DialogHeader.ATTR_BUTTON_CLOSE]
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            case DialogHeader.ATTR_TITLE: {
                this.updateLayout();
                break;
            }
            case DialogHeader.ATTR_TITLE_GRAVITY: {
                this.updateLayout();
                break;
            }
            case DialogHeader.ATTR_BUTTON_BACK: {
                this.updateLayout();
                break;
            }
            case DialogHeader.ATTR_BUTTON_CLOSE: {
                this.updateLayout();
                break;
            }
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this.updateLayout();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

    /**
     * @private
     */

    updateLayout() {
        let btnBack = this.buttonBack
        let btnClose = this.buttonClose
        let title = this.getAttribute(DialogHeader.ATTR_TITLE)
        let titleGrav = this.getAttribute(DialogHeader.ATTR_TITLE_GRAVITY)

        if (!titleGrav) titleGrav = 'start'
        if (!btnBack.icon) btnBack.icon = ''
        if (!btnClose.icon) btnClose.icon = ''

        this.innerHTML = `
        <h-box class="fs-dialog-header" w="100%" p="8px" v-grav="center">
            <img class="fs-dialog-header-button" src="${btnBack.icon}" w="40px" h="40px" 
                h-l-grav="start" v-l-grav="center" f-mode="button"
                visible="${btnBack.icon ? true : false}">
            <h-box w="100%" h="100%" h-grav="${titleGrav}">
                <p class="fs-dialog-title" m="0" h-p="8px">${title}</p>
            </h-box>
            <img class="fs-dialog-header-button" src="${btnClose.icon}" w="40px" h="40px" 
                h-l-grav="end" v-l-grav="center" f-mode="button"
                visible="${btnClose.icon ? true : false}">
        </h-box>`

        let btns = this.querySelectorAll('.fs-dialog-header-button')

        btns[0].onclick = () => {
            if (btnBack.onClick) {
                btnBack.onClick()
            }
        }

        btns[1].onclick = () => {
            if (btnClose.onClick) {
                btnClose.onClick()
            }
        }
    }

}

class DialogFooter extends HorizontalBox {

    static ATTR_BUTTON_POSITIVE = 'btn-positive';
    static ATTR_BUTTON_POSITIVE_ICON = 'btn-positive-icon';

    static ATTR_BUTTON_NEGATIVE = 'btn-negative';
    static ATTR_BUTTON_NEGATIVE_ICON = 'btn-negative-icon';

    static ATTR_BUTTON_NEUTRAL = 'btn-neutral';
    static ATTR_BUTTON_NEUTRAL_ICON = 'btn-neutral-icon';

    static get observedAttributes() {
        return super.observedAttributes.concat([
            this.ATTR_BUTTON_POSITIVE,
            this.ATTR_BUTTON_POSITIVE_ICON,
            this.ATTR_BUTTON_POSITIVE_ON_CLICK,
            this.ATTR_BUTTON_NEGATIVE,
            this.ATTR_BUTTON_NEGATIVE_ICON,
            this.ATTR_BUTTON_NEGATIVE_ON_CLICK,
            this.ATTR_BUTTON_NEUTRAL,
            this.ATTR_BUTTON_NEUTRAL_ICON,
            this.ATTR_BUTTON_NEUTRAL_ON_CLICK
        ]);
    }

    constructor() {
        super();
        this.btnNegativeOnClick = null
        this.btnPositiveOnClick = null
        this.btnNeutralOnClick = null
    }

    get buttonPositive() {
        return new IconTextButton(
            this.getAttribute(DialogFooter.ATTR_BUTTON_POSITIVE),
            this.getAttribute(DialogFooter.ATTR_BUTTON_POSITIVE_ICON),
            this.btnPositiveOnClick
        );
    }

    set buttonPositive(value) {
        if (value) {
            this.setAttribute(DialogFooter.ATTR_BUTTON_POSITIVE, value.text);
            this.setAttribute(DialogFooter.ATTR_BUTTON_POSITIVE_ICON, value.icon);
            this.btnPositiveOnClick = value.onClick
        } else {
            delete this.attributes[DialogFooter.ATTR_BUTTON_POSITIVE]
            delete this.attributes[DialogFooter.ATTR_BUTTON_POSITIVE_ICON]
            delete this.btnPositiveOnClick
        }
        this.updateLayout();
    }

    get buttonNegative() {
        return new IconTextButton(
            this.getAttribute(DialogFooter.ATTR_BUTTON_NEGATIVE),
            this.getAttribute(DialogFooter.ATTR_BUTTON_NEGATIVE_ICON),
            this.btnNegativeOnClick
        );
    }

    set buttonNegative(value) {

        if (value) {
            this.setAttribute(DialogFooter.ATTR_BUTTON_NEGATIVE, value.text);
            this.setAttribute(DialogFooter.ATTR_BUTTON_NEGATIVE_ICON, value.icon);
            this.btnNegativeOnClick = value.onClick
            console.log("setting btn negative to: " + value.text + " " + value.icon + " " + this.btnNegativeOnClick)
        } else {
            delete this.attributes[DialogFooter.ATTR_BUTTON_NEGATIVE]
            delete this.attributes[DialogFooter.ATTR_BUTTON_NEGATIVE_ICON]
            delete this.btnNegativeOnClick
            console.log("deleting btn negative")
        }
        this.updateLayout()
    }

    get buttonNeutral() {
        return new IconTextButton(
            this.getAttribute(DialogFooter.ATTR_BUTTON_NEUTRAL),
            this.getAttribute(DialogFooter.ATTR_BUTTON_NEUTRAL_ICON),
            this.btnNeutralOnClick
        );
    }

    set buttonNeutral(value) {
        if (value) {
            this.setAttribute(DialogFooter.ATTR_BUTTON_NEUTRAL, value.text);
            this.setAttribute(DialogFooter.ATTR_BUTTON_NEUTRAL_ICON, value.icon);
            this.btnNeutralOnClick = value.onClick
        } else {
            delete this.attributes[DialogFooter.ATTR_BUTTON_NEUTRAL]
            delete this.attributes[DialogFooter.ATTR_BUTTON_NEUTRAL_ICON]
            delete this.btnNeutralOnClick
        }
        this.updateLayout()
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            case DialogFooter.ATTR_BUTTON_POSITIVE:
            case DialogFooter.ATTR_BUTTON_POSITIVE_ICON:
            case DialogFooter.ATTR_BUTTON_NEGATIVE:
            case DialogFooter.ATTR_BUTTON_NEGATIVE_ICON:
            case DialogFooter.ATTR_BUTTON_NEUTRAL:
            case DialogFooter.ATTR_BUTTON_NEUTRAL_ICON: {
                this.updateLayout();
                break;
            }
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this.updateLayout();
        console.log("connected list neutral: " + this.btnNeutralOnClick)
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

    /**
     * @private
     */

    updateLayout() {
        let btnPositive = this.buttonPositive
        let btnNegative = this.buttonNegative
        let btnNeutral = this.buttonNeutral

        if (!btnPositive.icon) btnPositive.icon = ''
        if (!btnNegative.icon) btnNegative.icon = ''
        if (!btnNeutral.icon) btnNeutral.icon = ''

        this.classList.add('fs-dialog-footer')
        this.innerHTML = `
        <h-box class="fs-dialog-footer-button fs-dialog-btn-neutral" grav="center" visible="${btnNeutral.text ? true : false}" f-mode="button">
            <img src="${btnNeutral.icon}" width="24px" height="24px" visible="${btnNeutral.icon ? true : false}">
            <p style="padding-left: 8px;  margin: 0;">${btnNeutral.text}</p>
        </h-box>
        <h-box w="100%" v-grav="center" h-grav="end">
            <h-box class="fs-dialog-footer-button fs-dialog-btn-negative" grav="center" visible="${btnNegative.text ? true : false}" f-mode="button">
                <img src="${btnNegative.icon}" width="24px" height="24px" visible="${btnNegative.icon ? true : false}">
                <p style="padding-left: 8px;  margin: 0px;">${btnNegative.text}</p>
            </h-box>
            <h-box class="fs-dialog-footer-button fs-dialog-btn-positive" grav="center" visible="${btnPositive.text ? true : false}" f-mode="button">
                <img src="${btnPositive.icon}" width="24px" height="24px" visible="${btnPositive.icon ? true : false}">
                <p style="padding-left: 8px; margin: 0px;">${btnPositive.text}</p>
            </h-box>
        </h-box>`

        let btns = this.querySelectorAll('.fs-dialog-footer-button')

        btns[0].onclick = this.btnNeutralOnClick
        btns[1].onclick = this.btnNegativeOnClick
        btns[2].onclick = this.btnPositiveOnClick
    }

}

class DialogController {

    /**
     * @private
     */

    _footer = null

    /**
     * @private
     */

    _header = null

    /**
     * @private
     */
    _content = null


    constructor(modalContainerId, dialogId) {
        this.modalContainerId = modalContainerId
        this.dialogId = dialogId
        this.contentType = "none";
    }

    setTitle(title) {
        this.title = title
        if (this._header) {
            this._header.title = title ? title : ''
        }
        return this
    }

    setTitleGravity(gravity) {
        this.titleGravity = gravity
        if (this._header) {
            this._header.titleGravity = gravity
        }
        return this
    }

    setBackButton(icon, onClick) {
        this.headerButtonBack = new IconButton(icon, onClick)
        if (this._header) {
            this._header.buttonBack = this.headerButtonBack
        }
        return this
    }

    setCloseButton(icon, onClick) {
        this.headerButtonClose = new IconButton(icon, onClick)
        if (this._header) {
            this._header.buttonClose = this.headerButtonClose
        }
        return this
    }

    setPositiveButton(text, icon, onClick) {
        this.positiveButton = new IconTextButton(text, icon, onClick)
        if (this._footer) {
            this._footer.buttonPositive = this.positiveButton
        }
        return this
    }

    setNegativeButton(text, icon, onClick) {
        this.negativeButton = new IconTextButton(text, icon, onClick)
        if (this._footer) {
            this._footer.buttonNegative = this.negativeButton
        }
        return this
    }

    setNeutralButton(text, icon, onClick) {
        this.neutralButton = new IconTextButton(text, icon, onClick)
        if (this._footer) {
            this._footer.buttonNeutral = this.neutralButton
        }
        return this
    }

    setContentFromUrl(content) {
        this.content = content
        this.contentType = content ? "url" : "none"
        return this
    }

    setContentFromHtml(html) {
        this.content = html
        this.contentType = html ? "html" : "none"
        return this
    }

    setWidth(width) {
        this.width = width
        return this
    }

    setHeight(height) {
        this.height = height
        return this
    }

    setGravity(gravity) {
        this.gravity = gravity
        return this
    }

    setMargins(margins) {
        this.margins = margins
        return this
    }

    setCancelable(cancelable) {
        this.cancelable = cancelable
        return this
    }

    build() {
        let style = document.createElement('style')
        style.innerHTML = `.fs-dialog-header {
            background-color: #222;
            font-weight: bold;
            font-size: 20px;
            color: #fff;
        }

        .fs-dialog-footer {
            background-color: #222;
            color: #fff;
        }

        .fs-dialog-header-button {
            margin: 0;
            padding: 3px;
            border-radius: 20px;
            background-color: transparent;
        }

        .fs-dialog-header-button:hover {
            background-color: #00000055;
            transition: 0.2s;
        }

        .fs-dialog-footer-button {
            margin: 8px 4px;
            padding: 8px 14px;
            border-radius: 15px;
            background-color: #555;
        }

        .fs-dialog-footer-button img {
            background-color: transparent;
            border-radius: 1px;
            margin: 0;
            padding: 1px;
        }

        .fs-dialog-footer-button p {
            margin: 0px;
            padding: 0px;
            font-size: 14px;
            font-weight: bold;
            color: #fff;
            }
        .fs-dialog-footer-button:hover {
            opacity: 0.7;
            transition: 0.2s;
        }
        `

        let header = document.createElement('dialog-header')

        header.w = '100%'
        header.title = this.title ? this.title : ''
        header.titleGravity = this.titleGravity
        header.buttonBack = this.headerButtonBack
        header.buttonClose = this.headerButtonClose

        let footer = document.createElement('dialog-footer')

        footer.w = '100%'
        footer.buttonPositive = this.positiveButton
        footer.buttonNegative = this.negativeButton
        footer.buttonNeutral = this.neutralButton

        let content = document.createElement('c-box')

        if (this.contentType == "url") {
            content = document.createElement('c-box')
            content.setAttribute('src', this.content)
        } else if (this.contentType == "html") {
            content = document.createElement('b-box')
            if (isString(this.content)) {
                content.innerHTML = this.content
            } else {
                content.innerHTML = ''
                content.appendChild(this.content)
            }
        } else {
            content = document.createElement('b-box')
            content.innerHTML = ''
        }

        content.w = '100%'
        content.h = '100%'

        let dialog = document.createElement('v-box')
        dialog.setAttribute('id', this.dialogId)
        dialog.setAttribute('class', 'fs-dialog')
        dialog.setAttribute('w', '100%')
        dialog.setAttribute('h', '100%')

        dialog.appendChild(style)
        dialog.appendChild(header)
        dialog.appendChild(content)
        dialog.appendChild(footer)

        return dialog
    }

    show() {
        let modal = document.getElementById(this.modalContainerId)
        if (modal) {
            modal.show(this.dialogId, this.build(), {
                w: this.width,
                h: this.height,
                grav: this.gravity,
                m: this.margins,
                cancelable: this.cancelable
            })
        }
        return this
    }

    dismiss() {
        let modal = document.getElementById(this.modalContainerId)
        if (modal) {
            modal.dismiss(this.dialogId)
        }
    }

    dismissAll() {
        let modal = document.getElementById(this.modalContainerId)
        if (modal) {
            modal.dismissAll()
        }
    }

}

try {
    customElements.define('view-el', View);
    customElements.define('view-group', ViewGroup);
    customElements.define('l-box', LinearBox);
    customElements.define('v-box', VerticalBox);
    customElements.define('h-box', HorizontalBox);
    customElements.define('f-box', FreeBox);
    customElements.define('b-box', BoundBox);
    customElements.define('modal-container', ModalContainer);
    customElements.define('c-box', ContentBox);
    customElements.define('dialog-header', DialogHeader);
    customElements.define('dialog-footer', DialogFooter);
    //customElements.define('dialog-view', DialogView);
} catch (err) {
    // Failed to define custom element
    console.error(err);
}