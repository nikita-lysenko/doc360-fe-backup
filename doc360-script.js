// SLIDER HOMEPAGE CONFIG
const sliderHomeConfig = {
	infinite: true,
	dots: true,
	slidesToShow: 1,
	centerMode: false
};

// IFRAME HELPER

function iFrameHelper(iFramesAreaSelector, maxIframeWidth) {
	const iFrameProportion = 0.574;
	const iFrames = document.querySelectorAll(iFramesAreaSelector);

	function setIframeDimensions(iframe) {
		var parentWidth = iframe.parentElement.offsetWidth > maxIframeWidth ? maxIframeWidth : iframe.parentElement.offsetWidth;
		iframe.style.width = iframe.parentElement.offsetWidth + "px";
		iframe.style.height = parentWidth * iFrameProportion + "px";
	}

	function processIframes() {
		iFrames.forEach(iframe => {
			iframe.addEventListener("load", setIframeDimensions(iframe));
		});
	}

	this.init = function() {
		if (!iFrames) {
			console.log("no iframes");
			return;
		}
		processIframes();
		console.log(`${iFrames.length} iframes set`);
	};
}

// SCROLL TO TOP BUTTON

function ScrollToTop() {
	var THRESHOLD = 500;
	var DIRECTION_UP = "up";
	var DIRECTION_DOWN = "down";
	var SCROLL_DELAY = 500;
	var SCROLL_EASE = "swing";

	this.init = function() {
		this.$window = $(window);
		this.$container = $("html, body");
		this.$el = $(".js-scroll-top");
		this.direction = DIRECTION_DOWN;
		this.updateCurrentPosition();
		this.checkEdges();
		this.mapEvents();
		console.log("init scroll");
	};

	this.mapEvents = function() {
		this.$window.on("scroll", this.onScroll.bind(this));
		this.$el.on("click", this.onClick.bind(this));
	};

	this.onScroll = function() {
		this.updateCurrentPosition();
		this.checkEdges();
	};

	this.onClick = function() {
		this.scrollTop();
	};

	this.updateCurrentPosition = function() {
		this.currentPosition = this.$window.scrollTop();
	};

	this.checkEdges = function() {
		if (this.direction === DIRECTION_DOWN && this.currentPosition > THRESHOLD) {
			this.direction = DIRECTION_UP;
			this.toggleVisibility(true);
			return;
		}

		if (this.direction === DIRECTION_UP && this.currentPosition < THRESHOLD) {
			this.direction = DIRECTION_DOWN;
			this.toggleVisibility(false);
		}
	};

	this.toggleVisibility = function(visible) {
		if (visible) {
			this.$el.fadeIn();
		} else {
			this.$el.stop(true, true).fadeOut();
		}
	};

	this.scrollTop = function() {
		this.$container.animate(
			{
				scrollTop: 0
			},
			SCROLL_DELAY,
			SCROLL_EASE
		);

		return false;
	};
}

// SCRIPT AND LINK LOADING HELPER

function ScriptAndLinkLoader(selector) {
	this.containers = document.querySelectorAll(selector);

	this.scriptTag = function(source) {
		const scriptTag = document.createElement("script");
		scriptTag.src = source.dataset.src;
		source.appendChild(scriptTag);
	};

	this.linkTag = function(source) {
		const linkTag = document.createElement("link");
		linkTag.href = source.dataset.src;
		linkTag.rel = "stylesheet";
		document.head.appendChild(linkTag);
	};

	this.init = function() {
		if (this.containers.length == 0) return;
		Array.from(this.containers).map(item => {
			if (item.dataset.tagType == "link") {
				this.linkTag(item);
			}
			if (item.dataset.tagType == "script") {
				this.scriptTag(item);
			}
		});
	};
}

// SCRIPT EMBEDDER

function ScriptEmbedder(selector) {
	const scriptEmbedContainers = Array.from(document.querySelectorAll(selector));

	this.init = function() {
		if (!scriptEmbedContainers) return;

		scriptEmbedContainers.forEach(scriptEmbedContainer => {
			const scriptCode = scriptEmbedContainer.dataset.code;
			const scriptTag = document.createElement("script");
			scriptTag.innerHTML = scriptCode;
			scriptEmbedContainer.appendChild(scriptTag);
		});
	};
}

// ANCHORER

function Anchorer() {
	var TEXT_TO_ID_REGEX = /(\W)/gim;
	var GO_TO_ANCHOR_DELAY = 100;
	var SCROLL_DELAY = 500;
	var SCROLL_EASE = "swing";

	this.$container = $("html, body");
	this.$el = $(".content_container_text_sec");
	this.$targets = $("h1, h2, h3");
	this.headerHeight = getHeaderHeight();
	this.init = function() {
		this.appendAnchors();
		this.mapEvents();
	};

	function getHeaderHeight() {
		var hh = document.querySelector(".stickytop") || document.querySelector(".header_top");
		return hh.clientHeight;
	}

	this.mapEvents = function() {
		this.$el.on("click", ".js-anchorer__trigger", this.onClick.bind(this));
	};

	this.onClick = function(e) {
		var that = this;
		var href = $(e.currentTarget).attr("href");

		this.scrollToAnchor(href, function() {
			that.setHash(href);
		});

		return false;
	};

	this.appendAnchors = function() {
		var that = this;

		this.$targets.each(function(index, element) {
			var $element = $(element);
			var text = $element.text().trim() || "";
			$element
				.contents()
				.filter(function() {
					return this.nodeType === 3;
				})
				.remove();
			var id = that.normalize(text);
			$element.prepend(that.createAnchor(id, text));
		});
	};

	this.normalize = function(text) {
		if (!text) {
			return "here";
		}

		return text.toLowerCase().replace(TEXT_TO_ID_REGEX, "-");
	};

	this.createAnchor = function(id, text) {
		return `<a class="a-anchor js-anchorer__trigger" href="#${id}"><span class="a-anchor__target" id="${id}"></span>${text}</a>`;
	};

	this.scrollToAnchor = function(href, callback) {
		if (href.length < 2) {
			return;
		}
		var $anchor = $(href);
		if ($anchor.length < 1) {
			return;
		}

		// header height logic changed with spreader to clear fixed header
		var top = $anchor.offset().top - getHeaderHeight(); //this.headerHeight;
		this.$container.animate(
			{
				scrollTop: top
			},
			SCROLL_DELAY,
			SCROLL_EASE,
			callback
		);
	};

	this.setHash = function(value) {
		if (window.history) {
			window.history.replaceState(null, null, value);
			return;
		}
		window.location.hash = value;
	};
}

// TABS HANDLER

function TabHandler(selector, linkSelector, paneSelector) {
	this.tabContainer = document.querySelector(selector);

	this.init = () => {
		if (!this.tabContainer) return;
		this.tabs = this.tabContainer.querySelectorAll(linkSelector);
		this.tabPanes = this.tabContainer.querySelectorAll(paneSelector);
		this.mapEvents();
	};

	this.mapEvents = () => {
		this.tabs.forEach((tab, index) => {
			tab.tabIndex = [index];
			tab.addEventListener("click", e => {
				e.preventDefault();
				this.tabPanes.forEach(pane => {
					pane.classList.remove("active");
				});
				this.tabs.forEach(tab => {
					tab.classList.remove("active");
				});
				e.currentTarget.classList.add("active");
				this.tabPanes[e.currentTarget.tabIndex].classList.add("active");
			});
		});
	};
}

// IMAGE MAPSETER

function ImageMapster() {
	const resizeDelay = 25;
	const resizeTime = 25;
	this.mapsters = [];
	this.mapsterMaps = [];
	this.mapsterConfigs = [];

	this.mapsterConfigTemplate = {
		mapKey: "id",
		fillColor: "000000",
		fillOpacity: 0.5,
		showToolTip: true,
		toolTipClose: ["tooltip-click", "area-click", "image-mouseout", "area-mouseout"],
		toolTipContainer:
			'<div style="border: 1px solid #dadce0; border-radius: 4px; background: #fff; font-family:Circular, sans-serif; font-size: 16px; line-height: 1.5; color: inherit; position:absolute; width:250px; padding:12px; box-shadow: 0 2px 18px 0 #c7c9cb; opacity: 0.90; z-index: 9999;" />',
		areas: []
	};

	function checkMapster() {
		if ($ === undefined || !document.querySelector(".mapster-image")) {
			console.log("no mapster");
			return;
		}
		return true;
	}

	const mapsterResize = (maxWidth, maxHeight) => {
		this.mapsters.forEach(mapsterImage => {
			let imgWidth = $(mapsterImage).width(),
				imgHeight = $(mapsterImage).height(),
				newWidth = 0,
				newHeight = 0;

			if (imgWidth / maxWidth > imgHeight / maxHeight) {
				newWidth = maxWidth - 50;
			} else {
				newHeight = maxHeight - 100;
			}
			$(mapsterImage).mapster("resize", newWidth, newHeight, resizeTime);
		});
	};

	const onWindowResize = () => {
		var curWidth = $(this.mapsterContext).width(),
			curHeight = $(this.mapsterContext).height(),
			checking = false;
		if (checking) {
			return;
		}
		checking = true;
		window.setTimeout(() => {
			var newWidth = $(this.mapsterContext).width(),
				newHeight = $(this.mapsterContext).height();
			if (newWidth === curWidth && newHeight === curHeight) {
				mapsterResize(newWidth, newHeight);
			}
			checking = false;
		}, resizeDelay);
	};

	this.mapEvents = () => {
		$(window).bind("resize", onWindowResize);
	};

	this.getMapsterConfigs = () => {
		let mapsterConfigs = [];
		this.mapsterMaps.forEach(map => {
			let areas = map.querySelectorAll("area");
			let newConfig = Object.assign({}, this.mapsterConfigTemplate);
			newConfig.areas = this.getAreasData(areas);
			mapsterConfigs.push(newConfig);
		});
		return mapsterConfigs;
	};

	this.getAreasData = areas => {
		let configs = [];
		areas.forEach(area => {
			configs.push(Object.assign({}, area.dataset));
		});
		return configs;
	};

	this.init = () => {
		if (!checkMapster()) return;
		this.mapsters = document.querySelectorAll(".mapster-image");
		this.mapsterContext = document.querySelector(".main-content");
		this.mapsterMaps = document.querySelectorAll(".mapster-map");
		this.mapsterConfigs = this.getMapsterConfigs();
		this.mapsters.forEach((mapster, index) => {
			$(mapster).mapster(this.mapsterConfigs[index]);
		});

		this.mapEvents();
	};
}

// SEARCH FIELD "ENTER" TRIGGER

function searchEnterTrigger() {
	var input = document.getElementById("aa-search-input") || document.querySelector(".ais-SearchBox-input");
	var searchBtn = document.querySelector(".ais-SearchBox-submit");
	var searchContainer = document.querySelector(".algolia-autocomplete");

	function searchEventHandler(e) {
		if (e.keyCode == 13) {
			e.stopPropagation();
			e.stopImmediatePropagation();
			searchBtn.click();
		}
	}

	searchContainer.addEventListener("keydown", searchEventHandler, true);
}

// WATERMARK DISABLER

function watermarkDisabler() {
	var mark = document.querySelector(".watermark_logo");
	if (mark) mark.style.display = "none";
}

// MOBILE SEARCH OVERLAY

function mobileSearchOverlay() {
	var input = document.querySelector(".aa-input-search");
	var header = document.querySelector("#doc_header");

	if (window.innerWidth < 768) {
		input.addEventListener("focus", function(e) {
			if (!header.classList.contains("mob-overlay-active")) {
				header.classList.add("mob-overlay-active");
			}
		});

		input.addEventListener("blur", function(e) {
			if (header.classList.contains("mob-overlay-active")) {
				header.classList.remove("mob-overlay-active");
			}
		});
	}
}

// REPLACER FOR VERSION SELECTION

function versionSelectionReplacer() {
	var vSelect = document.querySelector("#doc_header .versions-selection");
	var docButtonsContainers = document.querySelectorAll("#doc_header .header_top_nav_right");

	docButtonsContainers.forEach(el => {
		el.querySelector("ul li").style.display = "none";
		var cln = vSelect.cloneNode(true);
		el.querySelector("ul").appendChild(cln);
	});
	vSelect.style.display = "none";
}

// EDIT ON GITHUB BUTTON CREATOR

function GithubUrlElem() {
	var GITHUB_CONTENT_PATH = "/blob/master/public";
	this.href = "https://github.com/spryker/spryker-documentation";
	this.link = document.createElement("li");
	this.parentSelector = ".content_block .content_container .content_block_head .article-action-items ul";

	this.init = function() {
		this.setLinkAttrs();
		this.appendLink();
		console.log("edit on github added");
	};

	this.setLinkAttrs = function() {
		this.link.classList.add(".js-widget-github");
		var href = this.href + GITHUB_CONTENT_PATH + window.location.pathname;
		this.link.innerHTML =
			'<div class="action-item"><i class="fa fa-github"></i><a class="widget-github-link" href=' +
			href +
			' target="_blank">Edit on Github</a></div>';
	};

	this.appendLink = function() {
		var parent = document.querySelector(this.parentSelector);
		var refElem = parent.children[parent.children.length - 1];
		parent.insertBefore(this.link, refElem);
	};
}

//SIDEBAR HEIGHT CALCULATOR

function sideBarHeightCalculator(selector, relativeElementSelector, margin) {
	this.element = document.querySelector(selector);
	this.relElem = document.querySelector(relativeElementSelector);
	this.screenHeight = window.innerHeight;
	this.defaultMargin = margin * 3;

	this.checkDistance = () => {
		var elementOffsetY = this.element.getBoundingClientRect().top;
		var relElemOffsetY = this.relElem.getBoundingClientRect().top;

		if (relElemOffsetY < this.screenHeight) {
			this.element.style.minHeight = relElemOffsetY - elementOffsetY - margin + "px";
		}
		if (relElemOffsetY > this.screenHeight) {
			this.element.style.minHeight = this.screenHeight - elementOffsetY - this.defaultMargin + "px";
		}
	};

	this.init = function() {
		if (!this.element) {
			console.log("no sideBar: " + selector);
			return;
		}
		window.addEventListener("load", this.checkDistance);
		window.addEventListener("scroll", this.checkDistance);
		console.log("sideBar height calculator: " + selector);
	};
}

//INPUT PLACEHOLDER CORRECOTOR

function inputPlaceholderCorrecotor(selector, placeholder) {
	this.input = document.querySelector(selector);
	this.init = function() {
		if (!this.input) return;

		this.input.placeholder = placeholder;
		this.input.onfocus = function() {
			this.placeholder = "";
		};
		this.input.onblur = function() {
			this.placeholder = placeholder;
		};
	};
}

//SELECT2 INITER FOR HUBSPOT FORMS

function select2IniterForHubspotForms() {
	document.addEventListener("hbsptInit", e => {
		var $hbptSelects = $(e.target).find("select");
		if ($hbptSelects.length != 0) {
			$hbptSelects.select2({ minimumResultsForSearch: -1 });
		} else {
			console.log("no hubspot forms");
		}
	});
}

/////////////////////////////////////////////////////////// INIT ////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
	new ScrollToTop().init();
	mobileSearchOverlay();
	searchEnterTrigger();
	window.addEventListener("resize", mobileSearchOverlay);
	//select2 init for hubspot forms
	select2IniterForHubspotForms();
	// INIT HOME PAGE ONLY
	if (document.querySelector("#home-page")) {
		//slider init
		const sliderHome = $(".slider-home");
		sliderHome.slick(sliderHomeConfig);
		sliderHome.on("init", iFrameHelper);
		//home page tabs hubspot
		new TabHandler(".tab-container", ".tab-nav-link", ".tab-pane").init();
		new iFrameHelper(".slider-home-container iframe", Infinity).init();
	}
	//////////////

	// INIT DOCS PAGE ONLY
	if (!document.querySelector("#home-page")) {
		new ScriptAndLinkLoader(".script-link-loader").init();
		new Anchorer().init();
		new ScriptEmbedder(".script-embed").init();
		new sideBarHeightCalculator(".left_sidebar_main", ".footer", 20).init();
		new sideBarHeightCalculator("#right_sidebar", ".footer", 20).init();
		sideBarHeightCalculator();
		//github button
		new GithubUrlElem().init();
		new ImageMapster().init();
		versionSelectionReplacer();
		watermarkDisabler();
		//placeholders swap
		new inputPlaceholderCorrecotor(".aa-input-search", "Looking for something specific? Search here").init();
		new inputPlaceholderCorrecotor("#category_filter", "Search by topics").init();
	}
	//////////////////
});
