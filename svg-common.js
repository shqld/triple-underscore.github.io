'use strict';

const source_data = {
	toc_main: 'MAIN',
	collectParts: Util.collectParts,
	init: EMPTY_FUNC,
};

Util.ready = function(){
//	source_data.section_map = Util.get_mapping(PAGE_DATA.section_map || '');
	source_data.init();
	Util.switchWordsInit(source_data);

	/* 展開状態で保存されたページがこの script を読み込まないようにする */
	repeat('script[src="svg-common.js"]', function(e){
		e.parentNode.removeChild(e);
	});
};

// source_data.populate = function(){};

source_data.generate = function(){
	const class_map = this.class_map;
	const tag_map = this.tag_map;

	const link_map = this.link_map;

	let context_ifc0 = '#';
	let context_ifc1 = '#';

	return this.html.replace(
		/%[\w\-~一-鿆あ-ん]+|`(.+?)([$@\^])(\w*)/g,
		create_html
	);

	function create_html(match, key, indicator, klass){
if(!indicator) {//%
	return `<var>${match.slice(1)}</var>`;
}

let text = key;
let href = '';
let classname = class_map[klass] || '';
let tag = tag_map[klass];

switch(klass){
case 'r': // ref
	text = `[${key}]`;
	href = `svg-refs.html#ref-${key.toLowerCase()}`;
	break;
case 't': // type
	text = `&lt;${text}&gt;`;
	break;
case 'ps': // pseudo-class
	text = `:${text}`;
	break;
case 'pe': // pseudo-element
	text = `::${text}`;
	break;
case 'at': // at-rule
	text = `@${text}`;
	break;
case 'l': // literal
	text = `"<code class="literal">${text}</code>"`;
	break;
case 'e':
	if(indicator === '@'){
		// SVG 要素は id が href 参照と異なる
		klass = ':';
		tag = 'code';
		href = `#elementdef-${key}`;
	}
	break;
case 'U': // 
	text = `U+${key}`;
	break;
case 'sec':
	text = `§ ${text}`;
	break;
case 'viewAs':
	return `<p><a href="~SVG2/images/${key}">~viewAs</a></p>`
	break;
case 'dgm':
	return `<a id="_dgm-${key}">＊</a>`;
	break;
case 'refer':
	text = '~~参照先';
	href = key;
	break;
case 'I0':
	context_ifc0 = `#__svg__${key}__`;
	klass = 'I';
	break;
case 'I1':
	href = link_map[`I.${key}`];
	if(href){
		context_ifc1 = `${href.slice(0, href.indexOf('#'))}#__svg__${key}__`;
	}
	klass = 'I';
	break;
case 'ACTION':
	text = `ACTION-${key}`;
	href = `http://www.w3.org/Graphics/SVG/WG/track/actions/${key}`;
	break;
case 'en': // english words
	return `<span lang="en-x-a0">${key}</span>`;
	break;
default:
	if(classname.slice(0, 3) === 'dom'){
		const n = text.indexOf('(');
		if(n > 0){
			key = text.slice(0, n);
			text = key + text.slice(n).replace(/\w+/g, '<var>$&</var>');
		}
		if(classname === 'dom0'){
			href = context_ifc0 + key;
		} else if(classname === 'dom1'){
			href = context_ifc1 + key;
		}
		classname = '';
	}
}

if(tag) {
	classname = classname ? ` class="${classname}"` : '';
	text = `<${tag}${classname}>${text}</${tag}>`;
}

if(indicator !== '^'){
	href = link_map[ klass ? `${klass}.${key}` : key ] || href;
	if(!href){
		console.log(match); // check error
		return match;
	}

	switch(indicator){
	case '$':
		text = `<a href="${href}">${text}</a>`;
		break;
	case '@':
		text = `<dfn id="${href.slice(1)}">${text}</dfn>`;
		break;
	default:
		console.log(match);
		return match;
	}
}

return text;

	}
};

/** class/tag mapping */
COMMON_DATA.class_map += `
e:element
eH:element
a:attr
p:property
v:value
t:type
et:event-type
at:at-rule
ps:pseudo
pe:pseudo
css:css
f:func
P:production
xl:ex-label
u:unit
U:code-point
op:op
E:error
`

COMMON_DATA.tag_map += `
I:code
I0:code
I1:code
E:code
m:code
p:code
v:code
e:code
eH:code
a:code
c:code
et:code
at:code
ps:code
pe:code
dfn:dfn
b:b
t:var
u:code
css:code
P:var
V:var
xl:i
U:span
op:span
i:i
em:em
cite:cite
`

// ●link
COMMON_DATA.link_map += `

	●IDL

E.NoModificationAllowedError:~WEBIDL#nomodificationallowederror
E.IndexSizeError:~WEBIDL#indexsizeerror
E.TypeError:~WEBIDL#exceptiondef-typeerror

I.GetSVGDocument:~SVGstruct#InterfaceGetSVGDocument
I.SVGAElement:~SVGlinking#InterfaceSVGAElement
I.SVGAngle:~SVGtypes#InterfaceSVGAngle
I.SVGAnimatedAngle:~SVGtypes#InterfaceSVGAnimatedAngle
I.SVGAnimatedBoolean:~SVGtypes#InterfaceSVGAnimatedBoolean
I.SVGAnimatedEnumeration:~SVGtypes#InterfaceSVGAnimatedEnumeration
I.SVGAnimatedInteger:~SVGtypes#InterfaceSVGAnimatedInteger
I.SVGAnimatedLength:~SVGtypes#InterfaceSVGAnimatedLength
I.SVGAnimatedLengthList:~SVGtypes#InterfaceSVGAnimatedLengthList
I.SVGAnimatedNumber:~SVGtypes#InterfaceSVGAnimatedNumber
I.SVGAnimatedNumberList:~SVGtypes#InterfaceSVGAnimatedNumberList
I.SVGAnimatedPoints:~SVGshapes#InterfaceSVGAnimatedPoints
I.SVGAnimatedPreserveAspectRatio:~SVGcoords#InterfaceSVGAnimatedPreserveAspectRatio
I.SVGAnimatedRect:~SVGtypes#InterfaceSVGAnimatedRect
I.SVGAnimatedString:~SVGtypes#InterfaceSVGAnimatedString
I.SVGAnimatedTransformList:~SVGcoords#InterfaceSVGAnimatedTransformList
I.SVGBoundingBoxOptions:~SVGtypes#SVGBoundingBoxOptions
I.SVGCircleElement:~SVGshapes#InterfaceSVGCircleElement
I.SVGDefsElement:~SVGstruct#InterfaceSVGDefsElement
I.SVGDescElement:~SVGstruct#InterfaceSVGDescElement
I.SVGDocument:~SVGstruct#InterfaceDocumentExtensions
I.SVGElement:~SVGtypes#InterfaceSVGElement
I.SVGElementInstance:~SVGstruct#InterfaceSVGElementInstance
I.SVGEllipseElement:~SVGshapes#InterfaceSVGEllipseElement
I.SVGFitToViewBox:~SVGtypes#InterfaceSVGFitToViewBox
I.SVGForeignObjectElement:~SVGembedded#InterfaceSVGForeignObjectElement
I.SVGGElement:~SVGstruct#InterfaceSVGGElement
I.SVGGeometryElement:~SVGtypes#InterfaceSVGGeometryElement
I.SVGGradientElement:~SVGpservers#InterfaceSVGGradientElement
I.SVGGraphicsElement:~SVGtypes#InterfaceSVGGraphicsElement
I.SVGImageElement:~SVGembedded#InterfaceSVGImageElement
I.SVGLength:~SVGtypes#InterfaceSVGLength
I.SVGLengthList:~SVGtypes#InterfaceSVGLengthList
I.SVGLineElement:~SVGshapes#InterfaceSVGLineElement
I.SVGLinearGradientElement:~SVGpservers#InterfaceSVGLinearGradientElement
I.SVGMarkerElement:~SVGpainting#InterfaceSVGMarkerElement
I.SVGMetadataElement:~SVGstruct#InterfaceSVGMetadataElement
I.SVGNameList:~SVGtypes#ListInterfaces
I.SVGNumber:~SVGtypes#InterfaceSVGNumber
I.SVGNumberList:~SVGtypes#InterfaceSVGNumberList
I.SVGPathElement:~SVGpaths#InterfaceSVGPathElement
I.SVGPatternElement:~SVGpservers#InterfaceSVGPatternElement
I.SVGPointList:~SVGshapes#InterfaceSVGPointList
I.SVGPolygonElement:~SVGshapes#InterfaceSVGPolygonElement
I.SVGPolylineElement:~SVGshapes#InterfaceSVGPolylineElement
I.SVGPreserveAspectRatio:~SVGcoords#InterfaceSVGPreserveAspectRatio
I.SVGRadialGradientElement:~SVGpservers#InterfaceSVGRadialGradientElement
I.SVGRectElement:~SVGshapes#InterfaceSVGRectElement
I.SVGSVGElement:~SVGstruct#InterfaceSVGSVGElement
I.SVGScriptElement:~SVGinteract#InterfaceSVGScriptElement
I.SVGStopElement:~SVGpservers#InterfaceSVGStopElement
I.SVGStringList:~SVGtypes#InterfaceSVGStringList
I.SVGStyleElement:~SVGstyling#InterfaceSVGStyleElement
I.SVGSwitchElement:~SVGstruct#InterfaceSVGSwitchElement
I.SVGSymbolElement:~SVGstruct#InterfaceSVGSymbolElement
I.SVGTSpanElement:~SVGtext#InterfaceSVGTSpanElement
I.SVGTests:~SVGtypes#InterfaceSVGTests
I.SVGTextContentElement:~SVGtext#InterfaceSVGTextContentElement
I.SVGTextElement:~SVGtext#InterfaceSVGTextElement
I.SVGTextPathElement:~SVGtext#InterfaceSVGTextPathElement
I.SVGTextPositioningElement:~SVGtext#InterfaceSVGTextPositioningElement
I.SVGTitleElement:~SVGstruct#InterfaceSVGTitleElement
I.SVGTransform:~SVGcoords#InterfaceSVGTransform
I.SVGTransformList:~SVGcoords#InterfaceSVGTransformList
I.SVGURIReference:~SVGtypes#InterfaceSVGURIReference
I.SVGUnitTypes:~SVGtypes#InterfaceSVGUnitTypes
I.SVGUseElement:~SVGstruct#InterfaceSVGUseElement
I.SVGUseElementShadowRoot:~SVGstruct#InterfaceSVGUseElementShadowRoot
I.SVGViewElement:~SVGlinking#InterfaceSVGViewElement
I.SVGZoomAndPan:~SVGtypes#InterfaceSVGZoomAndPan

I.Animation:~WANIMAPI#the-animation-interface
	~TR/web-animations-1/#the-animation-interface
I.Animatable:~WANIMAPI#animatable
	~SVGanim#Animatable
I.ShadowAnimation:~SVGstruct#InterfaceShadowAnimation
I.DOMMatrix:~GEOMETRY#dommatrix
	~TR/geometry-1/#dom-dommatrix
I.DOMMatrixReadOnly:~GEOMETRY#dommatrixreadonly
	~TR/geometry-1/#dom-dommatrixreadonly
I.DOMMatrix2DInit:~GEOMETRY#dictdef-dommatrix2dinit
I.DOMPoint:~GEOMETRY#dompoint
	~TR/geometry-1/#dom-dompoint
I.DOMPointInit:~GEOMETRY#dictdef-dompointinit
I.DOMPointReadOnly:~GEOMETRY#dompointreadonly
	~TR/geometry-1/#dom-dompointreadonly
I.DOMRect:~GEOMETRY#domrect
	~TR/geometry-1/#dom-domrect
I.DOMRectReadOnly:~GEOMETRY#domrectreadonly
	~TR/geometry-1/#dom-domrectreadonly
I.DOMTokenList:~DOM4#interface-domtokenlist
I.Document:~DOM4#document
I.DocumentAndElementEventHandlers:~WAPI#documentandelementeventhandlers
I.Element:~DOM4#element
I.GlobalEventHandlers:~WAPI#globaleventhandlers
I.HTMLHyperlinkElementUtils:~HTMLlinks#htmlhyperlinkelementutils
I.HTMLOrSVGElement:~HTMLdom#htmlorsvgelement
I.LinkStyle:~CSSOM1#the-linkstyle-interface
I.NodeList:~DOM4#interface-nodelist
I.ShadowRoot:~DOM4#interface-shadowroot
I.Window:~WINDOW#window
I.WindowEventHandlers:~WAPI#windoweventhandlers

	●e
e.a:~SVGlinking#AElement
e.animate:~SVGanim#AnimateElement
e.animateMotion:~SVGanim#AnimateMotionElement
e.animateTransform:~SVGanim#AnimateTransformElement
e.circle:~SVGshapes#CircleElement
e.clipPath:~MASKING1#ClipPathElement
e.defs:~SVGstruct#DefsElement
e.desc:~SVGstruct#DescElement
e.discard:~SVGanim#DiscardElement
e.ellipse:~SVGshapes#EllipseElement
e.foreignObject:~SVGembedded#ForeignObjectElement
e.g:~SVGstruct#GElement
e.image:~SVGembedded#ImageElement
e.line:~SVGshapes#LineElement
e.linearGradient:~SVGpservers#LinearGradientElement
e.marker:~SVGpainting#MarkerElement
e.mask:~MASKING1#MaskElement
e.metadata:~SVGstruct#MetadataElement
e.mpath:~SVGanim#MPathElement
e.path:~SVGpaths#PathElement
e.pattern:~SVGpservers#PatternElement
e.polygon:~SVGshapes#PolygonElement
e.polyline:~SVGshapes#PolylineElement
e.radialGradient:~SVGpservers#RadialGradientElement
e.rect:~SVGshapes#RectElement
e.script:~SVGinteract#ScriptElement
e.set:~SVGanim#SetElement
e.stop:~SVGpservers#StopElement
e.style:~SVGstyling#StyleElement
e.svg:~SVGstruct#SVGElement
e.switch:~SVGstruct#SwitchElement
e.symbol:~SVGstruct#SymbolElement
e.text:~SVGtext#TextElement
e.textPath:~SVGtext#TextPathElement
e.title:~SVGstruct#TitleElement
e.tspan:~SVGtext#TextElement
e.use:~SVGstruct#UseElement
e.view:~SVGlinking#ViewElement

e.feBlend:~FILTERS#feBlendElement
e.feColorMatrix:~FILTERS#feColorMatrixElement
e.feComponentTransfer:~FILTERS#feComponentTransferElement
e.feComposite:~FILTERS#feCompositeElement
e.feConvolveMatrix:~FILTERS#feConvolveMatrixElement
e.feDiffuseLighting:~FILTERS#feDiffuseLightingElement
e.feDisplacementMap:~FILTERS#feDisplacementMapElement
e.feDistantLight:~FILTERS#feDistantLightElement
e.feDropShadow:~FILTERS#feDropShadowElement
e.feFlood:~FILTERS#feFloodElement
e.feFuncA:~FILTERS#feFuncAElement
e.feFuncB:~FILTERS#feFuncBElement
e.feFuncG:~FILTERS#feFuncGElement
e.feFuncR:~FILTERS#feFuncRElement
e.feGaussianBlur:~FILTERS#feGaussianBlurElement
e.feImage:~FILTERS#feImageElement
e.feMerge:~FILTERS#feMergeElement
e.feMergeNode:~FILTERS#elementdef-femergenode
e.feMorphology:~FILTERS#feMorphologyElement
e.feOffset:~FILTERS#feOffsetElement
e.fePointLight:~FILTERS#fePointLightElement
e.feSpecularLighting:~FILTERS#feSpecularLightingElement
e.feSpotLight:~FILTERS#feSpotLightElement
e.feTile:~FILTERS#feTileElement
e.feTurbulence:~FILTERS#feTurbulenceElement
e.filter:~FILTERS#FilterElement

	HTML 要素
eH.a:~HEtextlevel#the-a-element
eH.base:~HEmetadata#the-base-element
eH.link:~HEmetadata#the-link-element
eH.meta:~HEmetadata#the-meta-element
eH.script:~HEscripting#the-script-element
eH.source:~HEimages#the-source-element
eH.style:~HEmetadata#the-style-element
eH.track:~HEmedia#the-track-element

	●p

p.alignment-baseline:~SVGtext#AlignmentBaselineProperty
p.baseline-shift:~SVGtext#BaselineShiftProperty
p.clip-path:~MASKING1#propdef-clip-path
p.clip-rule:~MASKING1#propdef-clip-rule
p.clip:~MASKING1#propdef-clip
p.color-interpolation-filters:~FILTERS#propdef-color-interpolation-filters
p.color-interpolation:~SVGpainting#ColorInterpolationProperty
p.color-rendering:~SVGpainting#ColorRenderingProperty
p.color:~SVGpainting#ColorProperty
p.cursor:~CSSUI#propdef-cursor
p.cx:~SVGgeometry#CxProperty
p.cy:~SVGgeometry#CyProperty
p.d:~SVGpaths#DProperty
p.direction:~SVGtext#DirectionProperty
p.display:~SVGrender#VisibilityControl
p.dominant-baseline:~SVGtext#DominantBaselineProperty
p.fill-opacity:~SVGpainting#FillOpacityProperty
p.fill-rule:~SVGpainting#FillRuleProperty
p.fill:~SVGpainting#FillProperty
p.filter:~FILTERS#propdef-filter
p.flood-color:~FILTERS#propdef-flood-color
p.flood-opacity:~FILTERS#propdef-flood-opacity
p.font:~CSSFONT#propdef-font
p.font-feature-settings:~CSSFONT#propdef-font-feature-settings
p.font-kerning:~CSSFONT#propdef-font-kerning
p.font-family:~CSSFONT#propdef-font-family
p.font-size-adjust:~CSSFONT#propdef-font-size-adjust
p.font-size:~CSSFONT#propdef-font-size
p.font-stretch:~CSSFONT#propdef-font-stretch
p.font-style:~CSSFONT#propdef-font-style
p.font-variant:~CSSFONT#propdef-font-variant
p.font-weight:~CSSFONT#propdef-font-weight
p.glyph-orientation-horizontal:~SVGtext#GlyphOrientationHorizontalProperty
p.glyph-orientation-vertical:~SVGtext#GlyphOrientationVerticalProperty
p.height:~SVGgeometry#Sizing
p.image-rendering:~SVGpainting#ImageRenderingProperty
p.inline-size:~SVGtext#InlineSizeProperty
p.letter-spacing:~CSSTEXT#propdef-letter-spacing
p.lighting-color:~FILTERS#propdef-lighting-color
p.line-height:~SVGtext#LineHeightProperty
p.isolation:~COMPOSITING#isolation
p.marker:~SVGpainting#MarkerProperty
p.marker-end:~SVGpainting#MarkerEndProperty
p.marker-mid:~SVGpainting#MarkerMidProperty
p.marker-start:~SVGpainting#MarkerStartProperty
p.mask:~MASKING1#propdef-mask
p.object-fit:~CSSIMAGE#propdef-object-fit
p.object-position:~CSSIMAGE#propdef-object-position
p.opacity:~SVGrender#ObjectAndGroupOpacityProperties
t.~opacity-prop:~SVGrender#ObjectAndGroupOpacityProperties
p.overflow:~SVGrender#OverflowAndClipProperties
p.paint-order:~SVGpainting#PaintOrderProperty
p.pointer-events:~SVGinteract#PointerEventsProperty
p.property:~SVGstyling#TermProperty
p.r:~SVGgeometry#RProperty
p.rx:~SVGgeometry#RxProperty
p.ry:~SVGgeometry#RyProperty
p.shape-inside:~SVGtext#ShapeInsideProperty
p.shape-image-threshold:~SVGtext#TextShapeImageThreshold
p.shape-margin:~SVGtext#ShapeMarginProperty
p.shape-padding:~SVGtext#TextShapePadding
p.shape-rendering:~SVGpainting#ShapeRenderingProperty
p.shape-subtract:~SVGtext#ShapesubtractProperty
p.stop-color:~SVGpservers#StopColorProperty
p.stop-opacity:~SVGpservers#StopOpacityProperty
p.stroke-dasharray:~SVGpainting#StrokeDasharrayProperty
p.stroke-dashoffset:~SVGpainting#StrokeDashoffsetProperty
p.stroke-linecap:~SVGpainting#StrokeLinecapProperty
p.stroke-linejoin:~SVGpainting#StrokeLinejoinProperty
p.stroke-miterlimit:~SVGpainting#StrokeMiterlimitProperty
p.stroke-opacity:~SVGpainting#StrokeOpacityProperty
p.stroke-width:~SVGpainting#StrokeWidthProperty
p.stroke:~SVGpainting#StrokeProperty
p.text-align-last:~CSSTEXT#propdef-text-align-last
p.text-align:~CSSTEXT#propdef-text-align
p.text-anchor:~SVGtext#TextAnchorProperty
p.text-decoration-color:~SVGtext#TextDecorationProperties
p.text-decoration-line:~SVGtext#TextDecorationProperties
p.text-decoration-style:~SVGtext#TextDecorationProperties
p.text-decoration:~SVGtext#TextDecorationProperties
p.text-indent:~CSSTEXT#propdef-text-indent
p.text-orientation:~CSSWM#propdef-text-orientation
p.text-overflow:~SVGtext#TextOverflowProperty
p.text-rendering:~SVGpainting#TextRenderingProperty
p.transform-box:~TRANSFORM#transform-box
p.transform-origin:~TRANSFORM#propdef-transform-origin
p.transform:~SVGcoords#TransformProperty
p.unicode-bidi:~CSSWM#propdef-unicode-bidi
p.vector-effect:~SVGcoords#VectorEffectProperty
p.vertical-align:~CSSINLINE#propdef-vertical-align
p.visibility:~SVGrender#VisibilityControl
p.white-space:~CSSTEXT#propdef-white-space
p.width:~SVGgeometry#Sizing
p.word-spacing:~CSSTEXT#propdef-word-spacing
p.writing-mode:~SVGtext#WritingModeProperty
p.x:~SVGgeometry#XProperty
p.y:~SVGgeometry#YProperty

	●t
t.number:~CSSVAL#number-value
t.integer:~CSSVAL#integer-value
t.length:~CSSVAL#length-value
t.percentage:~CSSVAL#percentage-value
	t.percentage:~CSSVAL#percentages
t.angle:~CSSVAL#angle-value
t.length-percentage:~CSSVAL#typedef-length-percentage
t.url:~CSSVAL#url-value
t.color:~CSSVAL#colors
t.alpha-value:~CSSCOLOR#typedef-alpha-value
t.paint:~SVGpainting#DataTypePaint
	t.paint:~SVGpainting#SpecifyingPaint
t.marker-ref:~SVGpainting#DataTypeMarkerRef
t.dasharray:~SVGpainting#DataTypeDasharray
t.icccolor:https://svgwg.org/specs/color/#DataTypeICCColor


~URLt:~SVGtypes#attribute-url


	●#Terms
	■conform
~UA:~SVGconform#TermUserAgent
~SVG~UA:~SVGconform#TermSVGUserAgent
~SVG著作~tool:~SVGconform#TermSVGAuthoringTool
~SVG~server:~SVGconform#TermSVGServer
~SVG生成器:~SVGconform#TermSVGGenerator
~SVG解釈器:~SVGconform#TermSVGInterpreter
~SVG~viewer:~SVGconform#TermSVGViewer


処理~mode:~SVGconform#processing-modes
~animate化~mode:~SVGconform#animated-mode
動的~対話的~mode:~SVGconform#dynamic-interactive-mode
動的~対話的~処理~mode:~SVGconform#dynamic-interactive-mode
~secure~animate化~mode:~SVGconform#secure-animated-mode
~secure静的~mode:~SVGconform#secure-static-mode
静的~mode:~SVGconform#static-mode

適合~SVG~DOM部分木:~SVGconform#ConformingSVGDOMSubtrees
適合~SVG生成器:~SVGconform#ConformingSVGGenerators
適合~SVG解釈器:~SVGconform#ConformingSVGInterpreters
適合~SVG~markup素片:~SVGconform#ConformingSVGFragments
適合~SVG自立的~file:~SVGconform#ConformingSVGStandAloneFiles
適合~SVG~viewer:~SVGconform#ConformingSVGViewers
適合~XML互換~SVG~markup素片:~SVGconform#ConformingSVGXMLFragments
適合~高品質~SVG~viewer:~SVGconform#ConformingHighQualitySVGViewers


	■render
描画~木:~SVGrender#TermRenderingTree
描画される要素:~SVGrender#TermRenderedElement
描画されない要素:~SVGrender#TermNonRenderedElement
再利用される~graphic:~SVGrender#TermReusedGraphics
決して描画されない要素:~SVGrender#TermNeverRenderedElement
描画-可能な要素:~SVGrender#TermRenderableElement
積層~文脈:~SVGrender#TermStackingContext

	■types
反映する:~SVGtypes#TermReflect
無効な値:~SVGtypes#TermInvalidValue
初期~値:~SVGtypes#TermInitialValue
数量-型の値:~SVGtypes#TermNumericTypeValue
直列化し直す:~SVGtypes#TermReserialize
~list~interface:~SVGtypes#TermListInterface

	■struct
~SVG名前空間:~SVGstruct#Namespace
~SVG要素:~SVGstruct#TermSVGElements
~graphics要素:~SVGstruct#TermGraphicsElement
容器~要素:~SVGstruct#TermContainerElement
構造的~要素:~SVGstruct#TermStructuralElement
構造的に外部の要素:~SVGstruct#TermStructurallyExternalElement
記述的~要素:~SVGstruct#TermDescriptiveElement
~graphicを参照する要素:~SVGstruct#TermGraphicsReferencingElement
中核~属性:~SVGstruct#TermCoreAttribute
条件付き処理~属性:~SVGstruct#TermConditionalProcessingAttribute
~ARIA属性:~SVGstruct#TermARIAAttribute

最外縁の~svg要素:~SVGstruct#TermOutermostSVGElement
~SVG文書片:~SVGstruct#TermSVGDocumentFragment
現在の~SVG文書片:#TermCurrentSVGDocumentFragment
~use要素の~shadow木:~SVGstruct#TermUseElementShadowTree
~instance根:~SVGstruct#TermInstanceRoot
~instance:~SVGstruct#TermElementInstance
要素~instance:~SVGstruct#TermElementInstance
対応している要素:~SVGstruct#TermCorrespondingElement
対応している~use要素:~SVGstruct#TermCorrespondingUseElement
参照先の~graphic:~SVGstruct#TermReferencedDocumentSubtree
参照先の文書~部分木:~SVGstruct#TermReferencedDocumentSubtree
参照先の要素:~SVGstruct#TermReferencedElement

	■coords
~canvas:~SVGcoords#TermCanvas
~SVG表示域:~SVGcoords#TermSVGViewport
初期~表示域:~SVGcoords#TermInitialViewport
表示域~座標系:~SVGcoords#TermViewportCoordinateSystem
利用元~単位:~SVGcoords#TermUserUnits
限界~box:~SVGcoords#TermBoundingBox
~obj限界~box:~SVGcoords#TermObjectBoundingBox
~stroke限界~box:~SVGcoords#TermStrokeBoundingBox
装飾d限界~box:~SVGcoords#TermDecoratedBoundingBox
最も遠い先祖の~SVG表示域:~SVGcoords#TermFurthestAncestorSVGViewport
正規化-済み対角線長さ:~SVGcoords#_normalized-diagonal

	■path
区分を完了して~pathを閉じる:~SVGpaths#TermSegment-CompletingClosePath
等価な~path:~SVGpaths#TermEquivalentPath
初期~点:~SVGpaths#TermInitialPoint
~pathの方向:~SVGpaths#TermPathDirection
~path区分:~SVGpaths#TermPathSegment

	■painting
~fill:~SVGpainting#TermFill
~stroke:~SVGpainting#TermStroke
~stroke図形:~SVGpainting#TermStrokeShape
塗り:~SVGpainting#TermPaint
塗り~server要素:~SVGpainting#TermPaintServerElement
文脈~要素:~SVGpainting#TermContextElement

	■linking
同一-文書~URL参照:~SVGlinking#TermSameDocumentURL
外部~資源~参照:~SVGlinking#TermExternalReference
~data~URL参照:~SVGlinking#TermDataURL
~URL参照:~SVGlinking#TermURLReference
未解決の参照:~SVGlinking#TermUnresolvedReference
素片~識別子~付き~URL参照:~SVGlinking#TermURLReferenceWithFragmentIdentifier
無効な参照:~SVGlinking#TermInvalidReference
無効な循環-参照:~SVGlinking#TermCircularReference

	■#Term 他

図形:~SVGshapes#TermShapeElement
図形~要素:~SVGshapes#TermShapeElement
基本~図形:~SVGshapes#TermBasicShapeElement

幾何~prop:~SVGgeometry#geometry-properties

~gradient要素:~SVGpservers#TermGradientElement

接触判定:~SVGinteract#TermHitTesting
~focus可能:~SVGinteract#TermFocusable
~event属性:~SVGinteract#TermEventAttribute
~graphic的~event属性:~SVGinteract#EventAttributes

~prop:~SVGstyling#TermProperty
呈示~属性:~SVGstyling#TermPresentationAttribute

~text内容~要素:~SVGtext#TermTextContentElement

~animation要素:~SVGanim#TermAnimationElement
~animation~event属性:~SVGanim#TermAnimationEventAttribute

画像~描画~用の矩形:~SVGembedded#TermImageRenderingRectangle
位置決め矩形:~SVGembedded#TermPositioningRectangle


	■用語
非推奨にされた~XLink属性:~SVGlinking#XLinkRefAttrs
~URL参照~属性:~SVGlinking#linkRefAttrs
	~URL参照:~SVGlinking#URLReference → ~SVGlinking#TermURLReference
~UA~stylesheet:~SVGstyling#UAStyleSheet

	■用語（外部
加法的でない:~CSSVAL#not-additive
無視する:~CSSSYN#css-ignored
既定の~sizing~algo:~CSSIMAGE#default-sizing-algorithm
	~CSSIMAGE#default-sizing
大域~event属性:~WAPI#globaleventhandlers
文書~要素~event属性:~WAPI#documentandelementeventhandlers
~CORS設定群~属性:~HTMLurl#cors-settings-attribute

`

// ●PREMAP
COMMON_DATA.PREMAP += `
要素名:<table class="elemdef"><tbody><tr><th>名前<td>
分類:<tr><th>分類<td>
内容:<tr><th>内容~model<td>
属性:<tr><th>属性<td>
幾何:<tr><th>幾何~prop<td>
界面:<tr><th>~DOM~interface<td>

属名:<table class="attrdef"><tbody><tr><th colspan="2">
属値:<tr><th>値<td>
属初:<tr><th>初期~値<td>
属ア:<tr><th>~animate可？<td>

`

// ●words_table

COMMON_DATA.words_table1 += `
	SVGintro:https://svgwg.org/svg2-draft/intro.html
SVGconform:svg-conform-ja.html
	~SVG2/conform.html
	~SVG2/render.html→common0.js
SVGtypes:https://svgwg.org/svg2-draft/types.html
	~SVG2/struct.html→common0.js
	~SVG2/styling.html→common0.js
	~SVG2/geometry.html→common0.js
	~SVG2/coords.html→common0.js
	~SVG2/paths.html→common0.js
	~SVG2/shapes.html→common0.js
	~SVG2/text.html→common0.js
	~SVG2/embedded.html→common0.js
	~SVG/painting.html→common0.js
	~SVG2/pservers.html→common0.js
	~SVG2/interact.html→common0.js
	~SVG2/linking.html→common0.js
SVGmisc:svg-misc-ja.html
	~SVG2/Overview.html
SVGchanges:svg-changes-ja.html
	~SVG2/implnote.html
	~SVG2/access.html
	~SVG2/animate.html
	~SVG2/mimereg.html

SVGanim:https://svgwg.org/specs/animations/
	GEOMETRY→common0.js
	GEOMETRY:https://www.w3.org/TR/geometry-1/
	GEOMETRY:https://www.w3.org/TR/2014/WD-geometry-1-20140522/
	GEOMETRY:https://www.w3.org/TR/2014/CR-geometry-1-20141125/

ARIA11:https://www.w3.org/TR/wai-aria-1.1/
SVGissue:https://github.com/w3c/svgwg/issues
xml_space:xml:space
xlink_href:xlink:href
xlink_title:xlink:title
use: <code class="element">use</code> 
svg: <code class="element">svg</code> 
URLt:[URL]
opacity-prop:'<code class="property">opacity</code>'

`

COMMON_DATA.words_table += `

	●略称
CSS:
DOM:
HTML:
	~HTML:HTML5
MathML:
ECMAScript:
SVG:
SVG-2:SVG 2
SVG-11:SVG 1.1
ARIA:
IDL:
WebIDL:Web IDL
	WebIDL:WebIDL
JS:JavaScript
HTTP:
Unicode:
DTD:
SMIL:
XML:
XHTML:
XLink:
2D:
3D:
Web:
web:
API:
attrdef:<p>Attribute definitions</p>:<p>attribute 定義：</p>:<p>属性定義：</p>
viewAs:View this example as SVG (SVG-enabled browsers only):この例を SVG で見る（要ブラウザ対応）

	●データ／型／演算
class:
data::::データ
item::::アイテム
list::::リスト
member::::メンバ
pair::::ペア
entry::::エントリ
作成-:create::~
作成:creation::~
値:value::~
初期:initial::~
初期化-:initialize::~
	初期化-:initialise
名:name::~
名前:name::~
型:type::~
変化-:change:~
変化:change:~
変更-:change:~
変更:change:~
属性:attribute::~
挿入-:insert::~
挿入:insertion::~
改変-:modify::~
改変:modification::~
新たな:new:~
演算-:operate::~
演算:operation::~
種別:type::~
空:empty:~
空の:empty な:~
範囲:range::~
clone::::クローン
複製:copy::~
取得-:get::~
設定-:set::~
設定:setting::~
設定群:settings::~
除去-:remove:~
除去:removal:~
付加-:append::~
置換-:replace::~
辞書:dictionary::~::ディクショナリ
配列:array::~
集合:set::~
整数:integer::~
公式:formula:~
数量-:numeric:~
数量的:numerical:~


	●構文
ID:
space:
keyword::::キーワード
token::::トークン
markup::::マークアップ
mark-up:mark up:::マークアップ
code::::コード
comma::::カンマ
escape::::エスケープ
構文解析-:parse::~::パース
構文解析:parsing::~::パース処理
構文解析器:parser::~::パーサ
直列化-:serialize::~::シリアル化
直列化:serialization::~::シリアル化
符号化-:encode::~::エンコード
符号化法:encoding::~::エンコーディング
文字:character::~
文字列:string::~
形式:format::~
成分:component::~
展開-:expand::~
形成-:form::~
合致-:match::~
内包-:include::~
内包:inclusion::~
構文:syntax:~
空白:whitespace::~
文法:grammar:~
識別子:identifier::~
妥当:valid::~
	妥当でない:invalid
妥当性:validity::~
無効:invalid::~
構成子:constructs::~
生成-:generate::~
生成:generation::~
生成器:generator::~::ジェネレータ
解釈器:interpreter::~::インタープリタ
生成規則:production::~


	●処理／IDL／event
flag::::フラグ
mode::::モード
call:
parameter::::パラメタ
event::::イベント
listener::::リスナ
target::::ターゲット
subject::対象
handler::::ハンドラ
interface::::インタフェース
method::::メソッド
mixin:
nullable:::null 可能
error::::エラー
構築-:construct::~
構築子:constructor::~::コンストラクタ
入力:input::~
出力:output::~
失敗-:fail:~
生成-:generate::~
生産-:produce::~
変異:mutation::~
変異不能:immutable::~
同期-:synchronize::~
	同期-:synchronise::~
例外:exception::~
投出:throw::~
発火-:fire::~
関数:function::~
誘発-:trigger::~
読専:read-only::~
引数:argument::~
状態:state::~
破棄-:discard:~
変換-:convert:~
変換:conversion:~
完了-:complete:~
完全:complete:~
開始-:start::~
評価-:evaluate::~
識別-:identify::~
呼出す:invoke する:呼び出す
呼出され:invoke され:呼び出され
呼出した:invoke した:呼び出した
呼出して:invoke して:呼び出して
呼出:invocation:呼び出し
被呼出時:被 invoke 時:~
実行-:execute:~
実行:execution:~
走らす:run する:~
走らせ:run し:~
走って:run して:~
起動-:initiate:~
環境:environment:~
即時に:immediate に:~
中止-:abort::~
停止-:stop::~
完遂-:finish::~
反復-:iterate::~
反復:iteration::~
繰返され:repeat され:繰り返され
繰返す:repeat する:繰り返す
並列的:parallel::~
設定子:setter::~
取得子:getter::~


	●構造
shadow:
node::::ノード
instance::::インスタンス
top-level::::トップレベル
obj:object:::オブジェクト
group::::グループ
	~group化する:grouping
host::::ホスト
svg:
木:tree::~
根:root::~
子:child::~
先祖:ancestor::~
子孫:descendant::~
	子孫:descendent
素片:fragment::~::フラグメント
文書:document::~
文書片:document fragment::~
視野:scope::~
文脈:context::~
内容:content::~
容器:container:::コンテナ
包含-:contain::~
不可分:atomic::~
下層の:underlying::~
要素:element::~
親:parent::~
構造化-:structure::~
構造的:structural::~
構造:structure::~
構造的:structural::~
入子に:nest::入れ子に
入子の:nested::入れ子の
部分木:subtree::~
隔離-:isolate::~
順序:order::~
名前空間:namespace::~
外来の:foreign::~
包装-:wrap:~
下位-:sub-:~
部位:portion:~
内縁:inner::~
外縁:outer::~
最外縁の:outermost::~
最外縁:outermost::~
最内縁の:innermost::~

	●幾何
CTM:
幾何:geometry::~
幾何-:geometric::~
幾何的:geometric::~
path::::パス
下位path:subpath:::下位パス
区分:segment::~
size::::サイズ
sizing::::サイズ法
offset::::オフセット
vector::::ベクター
span:
重合して:overlap して::重なり合って
重合しな:overlap しな::重なり合わな
限界:bounding::~
限界域:bounds::~
領域:region::~
交差-:intersect::~
交差:intersection::~
内側:inside::~
外側:outside::~
区画:area::~
外形線:outline::~
内域:interior::~

切取られ:clip され::切り取られ
切取った:clip した::切り取った
切抜かれ:clip され::切り抜かれ
切抜き:clipping::切り抜き
切抜く:clip する::切り抜く
境界:boundary::~

変形:transform::~
変形-:transform::~
変形n:transformation::変換
座標系変換:transformation::~
行列:matrix::~

拡縮-:scale::~
拡縮率:scale::~
拡縮:scaling::~
	拡縮-可能:scalable
並進-:translate::~
並進:translation::~
回転-:rotate::~
回転:rotation::~
斜傾:skew::~

平面:plane::~
原点:origin::~
座標:coordinate::~
座標系:coordinate system::~
利用元:user::~
図形:shape::~
寸法:dimension::~
次元:dimension::~
距離:distance::~
中心:center::~
半径:radius::~
	半径:radii
始端:start::~
終端:end::~
縦方向:vertical::~
横方向:horizontal::~
横幅:width::~
縦幅:height::~
縦横比:aspect ratio::~
側:side:~
配置-:place:~
位置-:position::~
位置:position::~
位置決め:positioning::~
方位-:orient::~
方位:orientation::~
直線:straight line::~
曲線:curve::~
真円:circle::~
真円な:circular な::真円の
矩形:rectangle::~
矩形な:rectangular な::矩形の
空間:space::~
軸:axis::~
無限:infinite:~
接触判定:hit-testing::~

	●塗り／色／効果
sRGB:
RGB:
RGBA:
ICC:
buffer::::バッファ
raster::::ラスター
	~raster化-:rasterize
bitmap::::ビットマップ
alpha::::アルファ
channel::::チャネル
canvas::::キャンバス
fill::::フィル
stroke::::ストローク
	~stroke時の:stroking
filter::::フィルタ
	~filter法:filtering
gradient:
graphic::::グラフィック
graphics::::グラフィックス
	~graphic的:graphical
grayscale::::グレイスケール
marker::::マーカ
mask::::マスク
masking::::マスク法
	~maskされ見えなくなる:masked out
pattern::::パタン
	~raster化-:rasterize
overflow::::過フロー
server::::サーバ
screen::::スクリーン
	~screen上の:onscreen
symbol::::シンボル
text::::テキスト
glyph::::グリフ
font::::フォント
red:
blue:
green:

背景:background::~
色:color::~
色停:color stop::~
黒:black::~
白:white::~
不透明:opaque::~
不透明度:opacity::~
透明:transparent::~
塗られ:paint され::塗られ
塗り:paint::~
塗る:paint する::~
塗れる:paint できる::~
塗らな:paint しな::~
塗ng:painting::塗り
前景:foreground::~
後景:backdrop::~
遮る:obscure する:~
描く:draw する::~
描ける:draw できる::~
描かれ:draw され::~
描かせ:draw させ::~
描いて:draw して::~
描かな:draw しな::~
描き:drawing::~
描直す:redraw する::描き直す
描直し:redraw::描き直し
絵図:drawing:~
具現化-:render::~
具現化:rendering::~
描画-:render::~
描画:rendering::~
	描画-可能:renderable
	描画され:rendered
	描画されない:non-rendered
効果:effect::~
原始filter:filter primitive:::原始フィルタ
混色-:blend::~
混色:blending::~
組成-:composite::~
組成:compositing::~
画像:image::~
層:layer::~::レイヤ
積層-:stack::~
積層:stacking::~
画素:pixel::~
解像度:resolution::~
装飾d:decorated::装飾

	● CSS
prop:property:::プロパティ
下位prop:subproperty::下位 property:下位プロパティ
styling::::スタイル付け
style::::スタイル
stylesheet:style sheet:::スタイルシート
cascade::::カスケード
宣言-:declare::~
宣言:declaration::~
宣言的:declarative::~
指定d:specifid:指定
算出d:computed::算出
算出:computation::~
算出-:compute::~
置換d:replaced::置換
疑似要素:pseudo-element::~
疑似類:pseudo-class::疑似 class:疑似クラス
使用:used::~
継承-:inherit::~
継承:inheritance::~
適用対象:applies to:~
視覚的:visual::~
内在的:intrinsic::~
百分率:percentage::~
絶対:absolute::~
絶対的:absolute::~
相対:relative::~
相対的:relative::~
長さ:length:~
	単位:unit::~
整形-:format::~
box::::ボックス
lay-out:lay out:::レイアウト
layout::::レイアウト
包含塊:containing block::包含 block:包含ブロック

	●呈示／UI
UI:
border::::ボーダー
animate::::アニメート
	~animate化:animated
	非~animate化:non-animated
animation::::アニメーション
click::::クリック
mouse::::マウス
window::::ウィンドウ
frame::::フレーム
pointer::::ポインタ
access::::アクセス
accessibility:::access 性:アクセス性:アクセシビリティ
keyboard::::キーボード
message::::メッセージ
title::::タイトル
view::::ビュー
viewer::::ビューア
focus::::フォーカス
	~focus可能:focusable
scroll::::スクロール
scrollbar::::スクロールバー
zoom::::ズーム
	~zoom法:zooming
pan::::パン
	~pan法:panning
辿り:traversal::~
呈示-:present::~
呈示:presentation::~
呈示hint:presentational hint::呈示 hint:呈示ヒント
静的:static::~
動的:dynamic::~
音声:audio::~
装置:device::~
可視:visible::~
可視の:visible な::~
可視性:visibility::~
視覚的:visual::~
表示-:display::~
表示:display::~
表示域:viewport::~::ビューポート
外観:appearance::~
対話:interaction::~
対話性:interactivity::~
対話的:interactive::~
隠され:hide され::~
隠す:hide する::~
隠せば:hide すれば::~
隠して:hide して::~
選択-:select::~
選択:selection::~
閲覧文脈:browsing context::~
作動化-:activate::~::アクティブ化
作動化:activation::~::アクティブ化
作動中の:active な::~::アクティブな
作動中:active::~::アクティブ
動作-:act::~::アクト
動作:action::~::アクション

	●資源
URL:
URI:
WOFF:
OpenType:
CORS:
JPEG:
PNG:
MIME:
fetch:
	~fetch法:fetching
download::::ダウンロード
link::::リンク
linking:::リンク法
hyperlink::::ハイパーリンク
inline::::インライン
navi:navigation:::ナビ
navigate::::ナビゲート
	navigate法:navigating
network::::ネットワーク
protocol::::プロトコル
scheme::::スキーム
source::::ソース
secure::::セキュア
security::::セキュリティ
page::::ページ
client:::クライアント
serve::::サーブ
同一-:same-::~
要請:request::~::リクエスト
応答:response::~::レスポンス
本体:body::~::ボディ
遠隔:remote::~::リモート
資源:resource::~:リソース
media::::メディア
媒体:media::~::メディア
multimedia::::マルチメディア
file::::ファイル
address::::アドレス
page::::ページ
埋込まれ:embed され::埋め込まれ
埋込む:embed する::埋め込む
埋込んで:embed して::埋め込んで
埋込d:embedded::埋め込み
読込み:loading::読み込み::ローディング
読込む:load する::読み込む::ロードする
読込まれ:load され::読み込まれ::ロードされ
読込んで:load して::読み込んで::ロードして
再読込する:reload する::読み込み直す::リロードする
動画:video::~::ビデオ

	●仕様
UA:user agent:UA
algo:algorithm:::アルゴリズム
app:application:::アプリ
応用:application:~
level::::レベル
metadata::::メタデータ
model::::モデル
module::::モジュール
option::::オプション
platform::::プラットフォーム
risk::::リスク
custom::::カスタム
version::::バージョン
software::::ソフトウェア
system::::システム
program::::プログラム
	~program的:programmatical
tool::::ツール
一様:uniform:~
不良:bad:~
中核:core:~
事例:case:~
仕方:way:~
仕組み:mechanism:~
付録:Appendix:~
判定基準:criteria:~
単純:simple:~
	単純に:simply
品質:quality:~
高品質:high-quality::~
	〜品質:-quality
基本:basic:~
基礎的:fundamental:~
実施:practice:~
実用上の:practical な:~
実質的:effective:~
実際:actual:~
実際の:actual な:~
将来:future:~
将来の:future:~
役割:role::~
後方互換:backwards compatible:~
後方互換性:backwards compatibility:~
手法:method:~
手続き:steps:~
旧来の:legacy な:~
有意:significant:~
条件:condition:~
条件付き:conditional:~
概念:concept:~
概念的:conceptual:~
正確:exact:~
特能:feature::~
状況:situation:~
理由:reason:~
用語:term:~
目的:purpose:~
直に:direct に:~
直接的:direct:~
間接的:indirect:~
能:ability:~
課題:issue:~
通常:normal:~
通常の:normal な:~
通常は:normal では:~
通常には:normal には:通常は
	normally
通常通り:as normal に:通常どおり
通例的:usual:~
道具:tool:~
関連する:relevant な:~
自動的:automatic:~
共通の:common な:~
共通しな:common でな:~
共通的に:common に:よく
共通的な:common な:よくある
詳細:details:~
詳細な:detailed:~
可用:available:~
意味論:semantics:~
意味論上の:semantic な:~
適切:appropriate:~
不適切:inappropriate:~
側面:aspect:~
言語:language:~
歴史的:historical:~
特徴:characteristic:~
一意:unique:~
明瞭:clear:~
類似する:similar な:~
	同様に:similarly／:similar
互換:compatible:~
互換性:compatibility:~
アリ:possible:可能
情報:information:~
自立的:standalone:~
	自立的:stand-alone
多彩:rich:~
能力:capability:~
適正:proper:~
手動:manual:~
安全:safe:~
基本的:basic:~
複階的:complex:~
概観:overview:~
相応しい:suitable な:~
望む:wish する:~
望まれ:wish され:~
求める:want する:~
求めら:want さ:~
容易:easy:~
	より容易に:easier
恣意的:arbitrary:~
一般:general:~
一般化-:generalize:~
一般的:general:~
指針:guideline:~
方式:manner:~
状況下:circumstances:~
帰結:consequence:~
汎用の:generic な:~
汎用:generic:~
注釈文:prose:~
概して:typical に:~

	決して:never
	例:example
	例えば:for example
	例：:e.g.,
	場合によっては:possibly
	すなわち:i.e.,
	具体例として:for instance
	しかしながら，:however
	したがって:therefore
	したがって:thus
	べき:should
	ものとする:shall
	因る:due to
	特に:in particular
	特に:particularly
	に注意:note／note that
	が:although
	であっても:even if
	と違って:unlike
	少なくとも:at least
	など:such as
	様に:like
	するためには:in order to
	少し:slightly
	に関して:with respect to
	方法:how to
	同様に:likewise
	呼応して:in response to
	させる:cause

	●仕様（動詞
browser::::ブラウザ
support::::サポート
test::::テスト
fallback::::フォールバック
fall-back:fall back:::フォールバック
feedback::::フィードバック
上書き:override:~
不正:incorrect:~
並行して:parallel に:~
付録:appendix:~
供-:provide:~
供せ:provide でき:~
供さな:provide しな:~
依存-:depend:~
依拠-:rely:~
保全-:preserve:~
保守-:maintain:~
先送り:defer:~
再構成-:rearrange:~
処理-:process:~
処理:processing:~
処理能:performance:~
利用:use:~
利用-:use:~
	利用して:using
再利用:reuse:~
再利用-:re-use:~
利用者:user:~
有用:useful:~
制御-:control:~
制御:control:~
制約-:restrict:~
制約:restriction:~
制約的:restrictive:~
制限-:limit:~
制限:limitation:~
勧告:Recommendation:~
勧告候補:Candidate Recommendation:~
参考:informative:~
取扱い:handling:取り扱い
取扱う:handle する:取り扱う
取扱われ:handle され:取り扱われ
取扱って:handle して:取り扱って
取扱わな:handle しな:取り扱わな
取扱える:handle できる:取り扱える
含意-:imply:~
含意:implications:~
変更点:changes:~
孕む:involve する:~
定義-:define:~
定義:definition:~
定義済みの:predefined:~
実装-:implement:~
実装:implementation:~
実装者:implementor:~
寄与-:contribute:~
尊重-:respect:~
序論:introduction:~
強調-:highlight:~
影響-:affect:~
意味-:mean:~
意味:meaning:~
意図-:intend:~
意図:intent:~
拘束-:constrain:~
拘束:constraint:~
拡張-:extend:~
拡張:extension:~
拡張能:extensibility:~
指定-:specify:~
指定:specification:~
	指定されていない:unspecified
	指定-法:specifying
特定の:specific な:~
特有の:specific な:~
特有な:-specific な:特有の
特有:specific:~
仕様:spec:~
特定的:specifical:具体的
特別:special:~
指示書き:instructions:~
挙動:behavior:ふるまい
挙動する:behave する:ふるまう
採用-:adopt:~
推奨-:recommend:~
推奨:recommendation:~
改めら:alter さ:~
改めな:alter しな:~
改める:alter する:~
改善-:improve:~
改善:improvement:~
明確化-:clarify:~
明確化:clarification:~
明示的:explicit:~
暗黙的:implicit:~
更新:update:~
更新-:update:~
期待-:expect:~
期待:expectation:~
予期-:expect:~
標準:standard:~
標準の:standard な:~
正しい:correct な:~
正しく:correct に:~
正した:correct した:~
決定-:determine:~
注釈:annotation:~
無視-:ignore:~
独立:independent:~
相互作用-:interact:~
示唆-:suggest:~
禁制-:prohibit:~
移動-:move:~
組込みの:built-in:~
統合-:integrate:~
統合:integration:~
統治-:govern:~
義務:mandatory:~
考慮-:consider:~
要件:requirement:~
要旨-:outline:~
要求-:require:~
要約-:summarize:~
見なさ:consider さ:~
見なす:consider する:~
見なせ:consider でき:~
規範的:normative:~
解決-:resolve:~
解決:resolution:~
未解決:unresolved::~
未解決の:unresolved::~
解釈-:interpret:~
解釈:interpretation:~
言及:mention:~
記述:description:~
記述的:descriptive:~
許容-:allow:~
	許容されない:disallowed
説明-:explain:~
説明:explanation:~
論じら:discuss さ:~
論じる:discuss する:~
論点:discussion:~
警告:warning:~
述べら:describe さ:~
述べる:describe する:~
述べた:describe した:~
述べて:describe して:~
述べれ:describe でき:~
遂行-:perform:~
適合-:conform:~
	適合する:are conformant
適合:conforming:~
不適合:non-conforming:~
適合性:conformance:~
適用-:apply:~
	適用-可能:applicable
適用:application:~
応用:application:~
関係-:relate:~
関係:relation:~
関係性:relationship:~
阻止-:block::~
非推奨に:deprecate:~
廃用に:obsolete:~
既知:known:~
既知の:known な:~
未知の:unknown:~
作者:author:~
確保-:ensure:~
給-:supply:~
公開-:expose:~
調整-:adjust:~
調整:adjustment:~
指名-:designate:~
存在-:exist:~
既存の:existing:~
分類:category:~
見做され:assume され:~
見做す:assume する:~
見做して:assume して:~
代替-:alternate:~
代替:alternative:~
組入れる:incorporate する:組み入れる
解-:understand:~
不能化-:disable:~
可能化-:enable:~
設計-:design:~
認識-:recognize:~
避ける:avoid する:~
導入-:introduce:~
指示-:indicate:~
指示:indication:~
受容-:accept:~
検査-:check:~
防止-:prevent:~
試み:attempt:~
試みる:attempt する:~
試みら:attempt さ:~
試みて:attempt して:~
試みた:attempt した:~
試みな:attempt しな:~
試みれ:attempt でき:~
裁定-:decide:~
裁定:decision:~
検分-:inspect:~
要旨-:outline:~
包摂-:encompass:~
固守-:adhere:~
奨励-:encourage:~
見出す:find する:~
見出せる:find できる:~
見出され:find され:~
見出して:find して:~
許可-:permit:~
観測-:observe:~
欲され:desire され:~
表出され:express され:表され
表出する:express する:表す
表出した:express した:表した
設置-:place:~
著作:authoring:~
受持つ:cover する:受け持つ
受持って:cover して:受け持って
落とす:drop する:~
落とし:drop し:~
落とさ:drop さ:~
言明-:state:~
言明:statement:~
相違-:differ:~
相違:difference:~
改称-:rename:~
補足-:supplement:~
補足的:supplemental:~

	則って:according
	則って:in accordance with
	〜に基づく:based／:-based
	織り込:take 〜 into account
	扱う:treat
	見よ:see
	見よ:refer to
	関わらず:regardless
	必要:need
	扱う:treat
	足る:sufficient
	含まれ／含む／含め:include
	除く／除いて／...:except
	従う:follow
	次のような:as follows
	次に従って:as follows
	次の／次に挙げる:the following

	●未分類（動詞
表現-:represent:~
表現:representation:~
除外-:exclude:~
導出-:derive:~
反映-:reflect:~
反映:reflection:~
共有-:share:~
共用:shared:~
伝播-:propagate::~
伝播:propagation::~
確立-:establish::~
所有者:owner::~
計算-:calculate::~
計算:calculation::~
関与-:participate::~
アテガう:assign する:あてがう
アテガえる:assign できる:あてがえる
アテガえな:assign できな::あてがえな
アテガわれ:assign され:あてがわれ
アテガって:assign して:あてがって
アテガおう:assign しよう:あてがおう
アテガわな:assign しな:あてがわな
対応付け:mapping::~
対応付けら:map さ::~
対応付ける:map する::~
追加-:add:~
追加:addition:~
追加的な:additional な:追加の
追加的に:additional に:追加で
	加えて:in addition
	加えて:additionally
参照-:reference::~
参照:reference::~
参照先の:referenced::~
参照元の:referencing::~
参照ng:referencing::参照
域外参照:cross-references::~
結付けら:associate さ:結び付けら
結付けて:associate して:結び付けて
登録-:register::~
登録:registration::~
組合せる:combine する:組み合せる
組合され:combine され:組み合され
組合せて:combine して:組み合せて
組合わせ:combination:組み合せ

	対応-:correspond
	現れる:appear
	示す:show
	起こる:happen
	生じ:occur
	在る:present

	●未分類
script::::スクリプト
scripting::::スクリプト処理
ナシ:none:なし

時列線:timeline::~
時刻:time::~
時機:timing::~
離散的:discrete::~
遷移:transition::~
等価:equivalent::~
精確:precise::~
既定の:default::~::デフォルト
既定:default::~::デフォルト
規則:rule::~
単位:unit:~
別名:alias:~
大域:global::~::グローバル
大域的:global::~::グローバル
局所:local::~::ローカル
局所的:local::~::ローカル
選定-:select:~
選定:selection:~
内部的:internal:~


	●指示語／機能語
元の:original:~
現在の:current:~
	現時点／現在:currently
自前の:own:~
単独の:single:~
外部:external:~
外部の:external な:~
特定0の:particular:ある特定の
全部的:full:~
部分的:partial:~

	一定の:certain
	0 :zero
	もの:one
	個:one／:two／:three／:four／:five／...
	個目:first／:second／:third／:fourth／:fifth／...
	〜の代わりに:instead
	いくつかの:several
	今や:now
	すでに:already
	常に:always
	ほぼ:almost
	ほとんどの／最も:most
	まで:at most
	ここ:here
	この:this
	これらの:these
	それらの:their
	すべての:all
	全体:entire
	何らかの:some
	一部の:some
	~~任意の:any
	任意の:arbitrary
	〜以上:or more
	その:that
	以前の／前の:previous
	それまでの:previous
	それまで:previously
	そのような:such
	その他:others
	他の:other
	以外の:other than
	それら:they
	それらを:them
	自身:itself／:themselves
	など:such as
	代わりに:instead
	依然として:still
	個々の:individual
	別の:another
	別々の:separate
	別個の:distinct
	単独の:single
	各:each
	同じ:same
	一致:identical
	多い:often
	多くの:many
	対応:correspond
	前:before
	後:after
	所与の:given
	最初の:first
	最後の:last
	異なる:different
	章:chapter
	節:section
	等々:etc
	結果:result
	複数の:multiple
	複数の:more than one
	通して:through
	残りの:remaining
	上:above
	下:below
	左:left
	両／両者:both
	後者:latter
	一部／一部を成す／成す部分:part of
	介:via
	超えて:beyond
	当の:in question
	他所:elsewhere
	間:during
	からなる:consist
	更なる:further
	最も近い:nearest
	何か:something
	どこでも:anywhere
	まったく:at all
	一緒:together
	様々な:various
	各種:various


`
