'use strict';

const source_data = {
//	toc_main: 'MAIN',
	init: EMPTY_FUNC,
};

Util.ready = function(){
//	source_data.section_map = Util.get_mapping(PAGE_DATA.section_map || '');
	source_data.init();

	Util.switchWordsInit(source_data);

	PAGE_DATA.ref_data = (PAGE_DATA.ref_data || '') + `
MESSAGING=主          ~/http-messaging-ja.html
SEMANTICS=主          ~/http-semantics-ja.html
CACHING=主            ~/http-cache-ja.html
`
	/* 展開状態で保存されたページがこの script を読み込まないようにする */
	repeat('script[src="http-common.js"]', function(e){
		e.parentNode.removeChild(e);
	});
};

// source_data.populate = function(){};

source_data.generate = function(){
	const class_map = this.class_map;
	const tag_map = this.tag_map;
	const link_map = this.link_map;
	const st_phrase = this.st_phrase;
//	const section_map = this.section_map;

	return this.html.replace(
		/`(.+?)([$@\^])(\w*)/g,
		create_html
	);

	function create_html(match, key, indicator, klass){

let text = key;
let href = '';
let tag = tag_map[klass];

switch(klass){
case 'r':
	text = `[${key}]`;
	href = `#${key}`;
	break;
case 'sec':
	{
		const keys = key.split('/');
		const spec = keys[0];
		const sec = keys[1];
		if(sec){
			text = `[${spec}] § ${sec}`;
			if(spec.slice(0,3) === 'RFC'){
				href = `~RFCx/rfc${spec.slice(3)}#section-${sec}`;
			}
		} else {
			text = `§ ${spec}`;
		}
		klass = '';
	}
	break;
case 'st': // status code
	text = `<code class="status">${key}</code> <span class="phrase">(${st_phrase[key]})</span>`;
	break;
case 'st0': // TODO st/st0＊
	klass = 'st';
	break;
case 'X':
	text = `%x${key}`;
	break;
case 'en': // english words
	return `<span lang="en-x-a0">${key}</span>`;
	break;
default:
}

if(tag) {
	let classname = class_map[klass];
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
	}
}

return text;

	}
};

/** class/tag mapping */
COMMON_DATA.class_map += `
r:ref
t:type
p:production
P:token
st:status
st0:status
wc:warn
h:header
m:method
dir:directive
qdir:directive
sdir:directive
com:comment
2119:rfc2119
X:hex-value
`

COMMON_DATA.tag_map += `
dfn:dfn
c:code
p:code
P:code
h:code
m:code
st:code
st0:code
wc:code
dir:code
qdir:code
sdir:code
com:span
X:span
V:var
i:i
em:em
cite:cite
2119:em
`


/** status phrase */
source_data.st_phrase = {
'1xx': 'Informational',
'2xx': 'Successful',
'3xx': 'Redirection',
'4xx': 'Client Error',
'5xx': 'Server Error',
'100': 'Continue',
'101': 'Switching Protocols',
'103': 'Early Hints',
'200': 'OK',
'201': 'Created',
'202': 'Accepted',
'203': 'Non-Authoritative Information',
'204': 'No Content',
'205': 'Reset Content',
'206': 'Partial Content',
'300': 'Multiple Choices',
'301': 'Moved Permanently',
'302': 'Found',
'303': 'See Other',
'304': 'Not Modified',
'305': 'Use Proxy',
'306': 'Unused',
'307': 'Temporary Redirect',
'308': 'Permanent Redirect',
'400': 'Bad Request',
'401': 'Unauthorized',
'402': 'Payment Required',
'403': 'Forbidden',
'404': 'Not Found',
'405': 'Method Not Allowed',
'406': 'Not Acceptable',
'407': 'Proxy Authentication Required',
'408': 'Request Timeout',
'409': 'Conflict',
'410': 'Gone',
'411': 'Length Required',
'412': 'Precondition Failed',
'413': 'Payload Too Large',
'414': 'URI Too Long',
'415': 'Unsupported Media Type',
'416': 'Range Not Satisfiable',
'417': 'Expectation Failed',
'418': '(Unused)',
'422': 'Unprocessable Payload',
'426': 'Upgrade Required',
'451': 'Unavailable For Legal Reasons', // RFC7725
'500': 'Internal Server Error',
'501': 'Not Implemented',
'502': 'Bad Gateway',
'503': 'Service Unavailable',
'504': 'Gateway Timeout',
'505': 'HTTP Version Not Supported',
};

// ●link
COMMON_DATA.link_map += `

	●fields

	//Semantics
h.Content-Encoding:~HTTPsem#field.content-encoding
h.Connection:~HTTPsem#field.connection
h.Content-Language:~HTTPsem#field.content-language
h.Content-Length:~HTTPsem#field.content-length
h.Content-Location:~HTTPsem#field.content-location
h.Content-Range:~HTTPsem#field.content-range
h.Content-Type:~HTTPsem#field.content-type
h.Host:~HTTPsem#field.host
h.TE:~HTTPsem#field.te
h.Trailer:~HTTPsem#field.trailer
h.Upgrade:~HTTPsem#field.upgrade
h.Via:~HTTPsem#field.via

h.Accept:~HTTPrq#field.accept
h.Accept-Charset:~HTTPrq#field.accept-charset
h.Accept-Encoding:~HTTPrq#field.accept-encoding
h.Accept-Language:~HTTPrq#field.accept-language
h.Authorization:~HTTPrq#field.authorization
h.Expect:~HTTPrq#field.expect
h.From:~HTTPrq#field.from
h.If-Match:~HTTPrq#field.if-match
h.If-Modified-Since:~HTTPrq#field.if-modified-since
h.If-None-Match:~HTTPrq#field.if-none-match
h.If-Range:~HTTPrq#field.if-range
h.If-Unmodified-Since:~HTTPrq#field.if-unmodified-since
h.Max-Forwards:~HTTPrq#field.max-forwards
h.Proxy-Authorization:~HTTPrq#field.proxy-authorization
h.Range:~HTTPrq#field.range
h.Referer:~HTTPrq#field.referer
h.User-Agent:~HTTPrq#field.user-agent

h.Accept-Ranges:~HTTPrs#field.accept-ranges
h.Allow:~HTTPrs#field.allow
h.Authentication-Info:~HTTPrs#field.authentication-info
h.Date:~HTTPrs#field.date
h.ETag:~HTTPrs#field.etag
h.Last-Modified:~HTTPrs#field.last-modified
h.Location:~HTTPrs#field.location
h.Proxy-Authenticate:~HTTPrs#field.proxy-authenticate
h.Proxy-Authentication-Info:~HTTPrs#field.proxy-authentication-info
h.Retry-After:~HTTPrs#field.retry-after
h.Server:~HTTPrs#field.server
h.Vary:~HTTPrs#field.vary
h.WWW-Authenticate:~HTTPrs#field.www-authenticate

	//Cache
h.Age:~HTTPcache#field.age
h.Cache-Control:~HTTPcache#field.cache-control
h.Expires:~HTTPcache#field.expires
h.Pragma:~HTTPcache#field.pragma
h.Warning:~HTTPcache#field.warning

	//Messaging
h.Transfer-Encoding:~HTTPmsg#field.transfer-encoding

	//他
h.Cookie:~HTTPcookie#sane-cookie
h.Set-Cookie:~HTTPcookie#sane-set-cookie
h.Link:~HTTPweblink#field.link

	h.URI
	h.Alternates:rfc2295#section-8.3

	●request methods
m.GET:~HTTPrq#GET
m.HEAD:~HTTPrq#HEAD
m.POST:~HTTPrq#POST
m.PUT:~HTTPrq#PUT
m.DELETE:~HTTPrq#DELETE
m.CONNECT:~HTTPrq#CONNECT
m.OPTIONS:~HTTPrq#OPTIONS
m.TRACE:~HTTPrq#TRACE
m.PATCH:~HTTPpatch#patch

	●status codes

st.1xx:~HTTPrs#status.1xx
st.2xx:~HTTPrs#status.2xx
st.3xx:~HTTPrs#status.3xx
st.4xx:~HTTPrs#status.4xx
st.5xx:~HTTPrs#status.5xx
st.100:~HTTPrs#status.100
st.101:~HTTPrs#status.101
st.200:~HTTPrs#status.200
st.201:~HTTPrs#status.201
st.202:~HTTPrs#status.202
st.203:~HTTPrs#status.203
st.204:~HTTPrs#status.204
st.205:~HTTPrs#status.205
st.206:~HTTPrs#status.206
st.300:~HTTPrs#status.300
st.301:~HTTPrs#status.301
st.302:~HTTPrs#status.302
st.303:~HTTPrs#status.303
st.304:~HTTPrs#status.304
st.305:~HTTPrs#status.305
st.306:~HTTPrs#status.306
st.307:~HTTPrs#status.307
st.308:~HTTPrs#status.308
st.400:~HTTPrs#status.400
st.401:~HTTPrs#status.401
st.402:~HTTPrs#status.402
st.403:~HTTPrs#status.403
st.404:~HTTPrs#status.404
st.405:~HTTPrs#status.405
st.406:~HTTPrs#status.406
st.407:~HTTPrs#status.407
st.408:~HTTPrs#status.408
st.409:~HTTPrs#status.409
st.410:~HTTPrs#status.410
st.411:~HTTPrs#status.411
st.412:~HTTPrs#status.412
st.413:~HTTPrs#status.413
st.414:~HTTPrs#status.414
st.415:~HTTPrs#status.415
st.416:~HTTPrs#status.416
st.417:~HTTPrs#status.417
st.418:~HTTPrs#status.418
st.422:~HTTPrs#status.422
st.426:~HTTPrs#status.426
st.500:~HTTPrs#status.500
st.501:~HTTPrs#status.501
st.502:~HTTPrs#status.502
st.503:~HTTPrs#status.503
st.504:~HTTPrs#status.504
st.505:~HTTPrs#status.505

	●protocol elements

	//5234
P.ALPHA:~HTTPcommon#P.ALPHA
P.CR:~HTTPcommon#P.CR
P.CRLF:~HTTPcommon#P.CRLF
P.CTL:~HTTPcommon#P.CTL
P.DIGIT:~HTTPcommon#P.DIGIT
P.DQUOTE:~HTTPcommon#P.DQUOTE
P.HEXDIG:~HTTPcommon#P.HEXDIG
P.HTAB:~HTTPcommon#P.HTAB
P.LF:~HTTPcommon#P.LF
P.OCTET:~HTTPcommon#P.OCTET
P.SP:~HTTPcommon#P.SP
P.VCHAR:~HTTPcommon#P.VCHAR
		TODO
		P.CHAR = %x01-7F
		P.NUL:
	//3986
p.URI-reference:~HTTPsem#p.URI-reference
p.absolute-URI:~HTTPsem#p.absolute-URI
p.relative-part:~HTTPsem#p.relative-part
p.authority:~HTTPsem#p.authority
p.uri-host:~HTTPsem#p.uri-host
p.path-abempty:~HTTPsem#p.path-abempty
p.segment:~HTTPsem#p.segment
p.query:~HTTPsem#p.query

p.scheme:~HTTPsem#p.scheme
p.host:~HTTPsem#p.host
p.port:~HTTPsem#p.port
p.path:~HTTPsem#p.path
p.fragment:~HTTPsem#p.fragment

	//Messaging
p.HTTP-message:~HTTPmsg#p.HTTP-message
p.HTTP-name:~HTTPmsg#p.HTTP-name
p.HTTP-version:~HTTPmsg#p.HTTP-version
p.Transfer-Encoding:~HTTPmsg#p.Transfer-Encoding
p.Age:~HTTPcache#p.Age
p.Cache-Control:~HTTPcache#p.Cache
p.Expires:~HTTPcache#p.Expires

p.absolute-form:~HTTPmsg#p.absolute-form
p.asterisk-form:~HTTPmsg#p.asterisk-form
p.authority-form:~HTTPmsg#p.authority-form
p.chunk:~HTTPmsg#p.chunk
p.chunk-data:~HTTPmsg#p.chunk-data
p.chunk-ext:~HTTPmsg#p.chunk-ext
p.chunk-ext-name:~HTTPmsg#p.chunk-ext-name
p.chunk-ext-val:~HTTPmsg#p.chunk-ext-val
p.chunk-size:~HTTPmsg#p.chunk-size
p.chunked-body:~HTTPmsg#p.chunked-body
p.field-line:~HTTPmsg#p.field-line
p.last-chunk:~HTTPmsg#p.last-chunk
p.message-body:~HTTPmsg#p.message-body
p.method:~HTTPmsg#p.method
p.obs-fold:~HTTPmsg#p.obs-fold
p.origin-form:~HTTPmsg#p.origin-form
p.reason-phrase:~HTTPmsg#p.reason-phrase
p.request-line:~HTTPmsg#p.request-line
p.request-target:~HTTPmsg#p.request-target
p.start-line:~HTTPmsg#p.start-line
p.status-code:~HTTPmsg#p.status-code
p.status-line:~HTTPmsg#p.status-line
p.trailer-section:~HTTPmsg#p.trailer-section
p.transfer-coding:~HTTPmsg#p.transfer-coding
p.transfer-parameter:~HTTPmsg#p.transfer-parameter

	//Semantics
p.BWS:~HTTPsem#p.BWS
p.OWS:~HTTPsem#p.OWS
p.RWS:~HTTPsem#p.RWS

p.Connection:~HTTPsem#p.Connection
p.Content-Encoding:~HTTPsem#p.Content-Encoding
p.Content-Language:~HTTPsem#p.Content-Language
p.Content-Length:~HTTPsem#p.Content-Length
p.Content-Location:~HTTPsem#p.Content-Location
p.Content-Range:~HTTPsem#p.Content-Range
p.Content-Type:~HTTPsem#p.Content-Type
p.Host:~HTTPsem#p.Host
p.Trailer:~HTTPsem#p.Trailer
p.TE:~HTTPsem#p.TE
p.Upgrade:~HTTPsem#p.Upgrade
p.Via:~HTTPsem#p.Via

p.absolute-path:~HTTPsem#p.absolute-path
p.byte-content-range:~HTTPsem#p.byte-content-range
p.byte-range-resp:~HTTPsem#p.byte-range-resp
p.charset:~HTTPsem#p.charset
p.comment:~HTTPsem#p.comment
p.complete-length:~HTTPsem#p.complete-length
p.connection-option:~HTTPsem#p.connection-option
p.content-coding:~HTTPsem#p.content-coding
p.ctext:~HTTPsem#p.ctext
p.field-content:~HTTPsem#p.field-content
p.field-name:~HTTPsem#p.field-name
p.field-value:~HTTPsem#p.field-value
p.field-vchar:~HTTPsem#p.field-vchar
p.first-pos:~HTTPsem#p.first-pos
p.http-URI:~HTTPsem#p.http-URI
p.https-URI:~HTTPsem#p.https-URI
p.incl-range:~HTTPsem#p.incl-range
p.int-range:~HTTPsem#p.int-range
p.language-tag:~HTTPsem#p.language-tag
p.last-pos:~HTTPsem#p.last-pos
p.media-type:~HTTPsem#p.media-type
p.obs-text:~HTTPsem#p.obs-text
p.other-content-range:~HTTPsem#p.other-content-range
p.other-range:~HTTPsem#p.other-range
p.parameter-name:~HTTPsem#p.parameter-name
p.parameter-value:~HTTPsem#p.parameter-value
p.parameter:~HTTPsem#p.parameter
p.parameters:~HTTPsem#p.parameters
p.partial-URI:~HTTPsem#p.partial-URI
p.protocol-name:~HTTPsem#p.protocol-name
p.protocol-version:~HTTPsem#p.protocol-version
p.protocol:~HTTPsem#p.protocol
p.pseudonym:~HTTPsem#p.pseudonym
p.qdtext:~HTTPsem#p.qdtext
p.quoted-pair:~HTTPsem#p.quoted-pair
p.quoted-string:~HTTPsem#p.quoted-string
p.qvalue:~HTTPsem#p.qvalue
p.range-resp:~HTTPsem#p.range-resp
p.range-set:~HTTPsem#p.range-set
p.range-spec:~HTTPsem#p.range-spec
p.range-unit:~HTTPsem#p.range-unit
p.ranges-specifier:~HTTPsem#p.ranges-specifier
p.rank:~HTTPsem#p.rank
p.received-by:~HTTPsem#p.received-by
p.received-protocol:~HTTPsem#p.received-protocol
p.subtype:~HTTPsem#p.subtype
p.suffix-length:~HTTPsem#p.suffix-length
p.suffix-range:~HTTPsem#p.suffix-range
p.t-codings:~HTTPsem#p.t-codings
p.t-ranking:~HTTPsem#p.t-ranking
p.tchar:~HTTPsem#p.tchar
p.token:~HTTPsem#p.token
p.type:~HTTPsem#p.type
p.unsatisfied-range:~HTTPsem#p.unsatisfied-range
p.userinfo:~HTTPsem#p.userinfo
p.weight:~HTTPsem#p.weight

p.HTTP-date:~HTTPsem#p.HTTP-date
p.IMF-fixdate:~HTTPsem#p.IMF-fixdate
p.day-name:~HTTPsem#p.day-name
p.date1:~HTTPsem#p.date1
p.day:~HTTPsem#p.day
p.month:~HTTPsem#p.month
p.year:~HTTPsem#p.year
p.GMT:~HTTPsem#p.GMT
p.time-of-day:~HTTPsem#p.time-of-day
p.hour:~HTTPsem#p.hour
p.minute:~HTTPsem#p.minute
p.second:~HTTPsem#p.second
p.obs-date:~HTTPsem#p.obs-date
p.rfc850-date:~HTTPsem#p.rfc850-date
p.date2:~HTTPsem#p.date2
p.day-name-l:~HTTPsem#p.day-name-l
p.asctime-date:~HTTPsem#p.asctime-date
p.date3:~HTTPsem#p.date3

p.Range:~HTTPrq#p.Range
p.accept-ext:~HTTPrq#p.accept-ext
p.accept-params:~HTTPrq#p.accept-params
p.auth-param:~HTTPrq#p.auth-param
p.auth-scheme:~HTTPrq#p.auth-scheme
p.challenge:~HTTPrq#p.challenge
p.codings:~HTTPrq#p.codings
p.credentials:~HTTPrq#p.credentials
p.expectation:~HTTPrq#p.expectation
p.language-range:~HTTPrq#p.language-range
p.mailbox:~HTTPrq#p.mailbox
p.media-range:~HTTPrq#p.media-range
p.product-version:~HTTPrq#p.product-version
p.product:~HTTPrq#p.product
p.token68:~HTTPrq#p.token68

p.Location:~HTTPrs#p.Location
p.acceptable-ranges:~HTTPrs#p.acceptable-ranges
p.delay-seconds:~HTTPrs#p.delay-seconds
p.entity-tag:~HTTPrs#p.entity-tag
p.etagc:~HTTPrs#p.etagc
p.opaque-tag:~HTTPrs#p.opaque-tag
p.weak:~HTTPrs#p.weak

	//Cache
p.cache-directive:~HTTPcache#p.cache-directive
p.delta-seconds:~HTTPcache#p.delta-seconds

	●code 他
c.chunked:~HTTPmsg#chunked.encoding
c.compress:~HTTPsem#compress.coding
c.deflate:~HTTPsem#deflate.coding
c.gzip:~HTTPsem#gzip.coding
c.identity:~HTTPrq#identity-token
c.100-continue:~HTTPrq#100-continue

c.http:~HTTPsem#http.uri
c.https:~HTTPsem#https.uri
c.multipart/byteranges:~HTTPsem#multipart.byteranges
c.multipart:~HTTPsem#multipart.types

c.realm:~HTTPrq#realm


	●用語

~HTTP11:~HTTPmsg#version-1.1
転送~符号法:~HTTPmsg#transfer.codings
転送~符号法の名前:~HTTPmsg#transfer-coding-name

	// -> semantics
~HTTP要請:~HTTPsem#request
~stateless:~HTTPsem#stateless
上流:~HTTPsem#upstream
下流:~HTTPsem#downstream
内方:~HTTPsem#inbound
外方:~HTTPsem#outbound
端点:~HTTPsem#endpoint
端点間:~HTTPsem#end-to-end
隣点間:~HTTPsem#hop-by-hop
連鎖:~HTTPsem#chain
~UA:~HTTPsem#user-agent
~client:~HTTPsem#client
~server:~HTTPsem#server
~gateway:~HTTPsem#gateway
~tunnel:~HTTPsem#tunnel
~proxy:~HTTPsem#proxy
~cache:~HTTPsem#cache
送信者:~HTTPsem#sender
中継者:~HTTPsem#intermediary
受信者:~HTTPsem#recipient
生成され:~HTTPsem#generate
生成し:~HTTPsem#generate
生成する:~HTTPsem#generate
生成元~server:~HTTPsem#origin-server
	~version法:~HTTPsem#protocol.version
	~version番号:~HTTPsem#version-number
~major~version:~HTTPsem#major-version
~minor~version:~HTTPsem#minor-version
応答:~HTTPsem#response
要請:~HTTPsem#request
完全:~HTTPsem#complete
不完全:~HTTPsem#complete
~parameter:~HTTPsem#parameter

素片~識別子:~HTTPsem#uri.fragment.identifiers

表現:~HTTPsem#representation
~field:~HTTPsem#fields
~field名:~HTTPsem#field-name
~field値:~HTTPsem#field-value
	~field:~HTTPsem#header.and.trailer.fields
	~field値:~HTTPsem#field.values
	~field名:~HTTPsem#field.names
~field行l:~HTTPsem#field-line
~field行l値:~HTTPsem#field-line-value
単数~field:~HTTPsem#singleton-field
~listに基づく~field:~HTTPsem#list-based-field
~header節:~HTTPsem#header-section
~trailer節:~HTTPsem#trailer-section
~header:~HTTPsem#header-field
~trailer:~HTTPsem#trailer-field
~payload:~HTTPsem#payload
~message~payload:~HTTPsem#payload
~payload本体:~HTTPsem#payload.body
~message本体:~HTTPsem#message-body

~URI:~HTTPsem#uri
~target~URI:~HTTPsem#target-URI
~target資源:~HTTPsem#target-resource
要請~target:~HTTPsem#request-target
空白:~HTTPsem#whitespace
~charset:~HTTPsem#charset
内容~符号法:~HTTPsem#content.codings
内容~符号法の名前:~HTTPsem#p.content-coding
資源:~HTTPsem#resources
~MIME型:~HTTPsem#media.type
	~MIME型:~HTTPsem#media.type
~MIME型~parameter:~HTTPsem#media-type.parameter
日時:~HTTPsem#http.date

複部位:~HTTPsem#multipart
指紋収集:~HTTPsem#fingerprinting
資源:~HTTPsem#resources
表現:~HTTPsem#representation
選定された表現:~HTTPsem#selected-representation
選定される表現:~HTTPsem#selected-representation
~metadata:~HTTPsem#representation.metadata
言語~tag:~HTTPsem#language.tags
表現~data:~HTTPsem#representation.data
表現~metadata:~HTTPsem#representation.metadata
表現~header:~HTTPsem#representation.metadata
内容~折衝:~HTTPsem#content.negotiation
~proactive折衝:~HTTPsem#proactive.negotiation
~reactive折衝:~HTTPsem#reactive.negotiation
要請~payload折衝:~HTTPsem#request.payload.negotiation
品質値:~HTTPsem#quality.values
品質~値:~HTTPsem#quality.values

形式変換-:~HTTPsem#message.transformations
形式変換:~HTTPsem#message.transformations

~payload~header:~HTTPsem#payload-headers

範囲~単位:~HTTPsem#range.units
~byte範囲:~HTTPsem#byte.ranges
結合-:~HTTPsem#combine-headers

~cache可能:~HTTPsem#cacheable.methods

	範囲~単位:~7233#range.units
	範囲~要請:~7233#range.requests
	部分的~要請:~7233#range.requests

適合性:~HTTPsem#conformance

		●HTTPrq
要請~header:~HTTPrq#request.header.fields
内容~折衝の~subject:~HTTPrq#request.conneg
~proactive折衝~header:~HTTPrq#request.conneg
期待:~HTTPrq#field.expect
~method:~HTTPrq#methods
~server-wide:~HTTPrq#server-wide
冪等:~HTTPrq#idempotent.methods
冪等~method:~HTTPrq#idempotent.methods
制御~header:~HTTPrq#request.controls
安全:~HTTPrq#safe.methods
要請~method:~HTTPrq#methods
要請の意味論:~HTTPrq#methods

条件付き要請:~HTTPrq#preconditions
事前条件:~HTTPrq#precondition
条件付き要請~header:~HTTPrq#preconditions
事前条件~header:~HTTPrq#preconditions
資格証:~HTTPrq#credentials
保護~空間:~HTTPrq#protection-space
認証~scheme:~HTTPrq#authentication-scheme
認証~parameter:~HTTPrq#authentication-parameter
正準的~root~URI:~HTTPrq#canonical-root-URI
製品~識別子:~HTTPrq#product-identifier
範囲~要請:~HTTPrq#field.range
更新喪失:~HTTPrq#lost-update

	●HTTPrs
応答~header:~HTTPrs#response.header.fields
応答class:~HTTPrs#responce-class
応答~状態s~code:~HTTPrs#status.codes
状態s~code:~HTTPrs#status.codes
	資源:~7231#resources
	~MIME型:~7231#media.type
暫定-応答:~HTTPrs#interim-response
最終-応答:~HTTPrs#final-response
	#final-interim

時計:~HTTPrs#clock
検証子~header:~HTTPrs#response.validator
検証子:~HTTPrs#response.validator
強い検証子:~HTTPrs#strong-validator
弱い検証子:~HTTPrs#weak-validator
	強い:~HTTPrs#strong-validator
	弱い:~HTTPrs#weak-validator
強い比較~関数:~HTTPrs#strong-comparison
弱い比較~関数:~HTTPrs#weak-comparison
改変~日時:~HTTPrs#modification-date
~messageの出生日時:~HTTPrs#origination-date
部分的な応答:~HTTPrs#status.206
部分的:~HTTPrs#status.206
首な資源:~HTTPrs#primary-resource
選定用~header:~HTTPrs#selecting-header
制御~data:~HTTPrs#response.control.data
満足可能:~HTTPrs#satisfiable
	満足不能:~HTTPsem#unsatisfiable

		●HTTPcache
経験的に~cache可能:~HTTPcache#heuristically-cacheable
~cache検証:~HTTPcache#validation.model
~cache検証~要請:~HTTPcache#validation.sent
鮮度~情報:~HTTPcache#calculating.freshness.lifetime
共用~cache:~HTTPcache#shared-cache
私用~cache:~HTTPcache#private-cache
	~cache:~HTTPcache#cache


		●
		著作者連絡先:#_spec_metadata
IETF による考査:~RFCx/rfc8126#section-4.8
`

// 
COMMON_DATA.words_table1 += `

●●words_table1

RFC8246:http-immutable-response-ja.html
RFC7538:http-status-code-308-ja.html
HTTPpatch:http-patch-ja.html

IANA-a:https://www.iana.org/assignments
	ERRATA:https://www.rfc-editor.org/errata_search.php
ERRATA:https://www.rfc-editor.org/errata

ナラナイ:<em class="rfc2119">ならない</em>
ベキ:<em class="rfc2119">べき</em>
ヨイ:<em class="rfc2119">よい</em>
OUGHT:べき.である

Ps:%s
	Pi:%i

HTTP09: HTTP/0.9 
HTTP10: HTTP/1.0 
HTTP11: HTTP/1.1 
	HTTP1x:

`

COMMON_DATA.words_table += `

●●words_table
伝え:informし:~
伝える:informする:~
切替:switching::切り替え
切替わる:switchする::切り替わる
切替え:switchし::切り替え
切替えら:switchさ::切り替えら
切替える:switchする::切り替える
割振ら:allocateさ:割り振ら
割振る:allocateする::割り振る
アテガえな:assignできな:あてがえな
含まな:includeしな:~
含ませ:includeさせ:~
含まれ:includeされ:~
含む:includeする:~
含めて:includeして:~
含めな:includeしな:~
含めら:includeさ:~
含める:includeする:~
含んで:includeして:~
内包-:include:~
内包:inclusion:~

始まる:beginする:~
指す:referする:~
指し:referし:~
指され:referされ:~
書込み:write::書き込み
書込め:writeでき::書き込め
書込んで:writeして::書き込んで
書換え:rewriteし::書き換え
書換える:rewriteする::書き換える
読取っ:readし::読み取っ
読取ら:readし::読み取ら
読取られ:readされ::読み取られ
読取り:read::読み取り
読取る:readする::読み取る
読取れ:readでき::読み取れ
読取可能:readable::読み取り可能
繰返し:repetition:繰り返し
繰返した:repeatした:繰り返した
繰返して:repeatして:繰り返して
繰返せ:repeatでき:繰り返せ


渡され:passされ:~
渡す:passする:~

満足さ:satisfyさ:満たさ
満足し:satisfyし:満たし
満足しな:satisfyしな:満たさな
満足しよ:satisfyしよ:満たそ
満足する:satisfyする:満たす
満足でき:satisfyでき:満たせ
満足可能:satisfiable:~
	満足可能でない:unsatisfiable
結付法:associating:結び付け
見出させ:findさせ:~
運ばせ:carryさせ::~
運ばれ:carryされ::~
運ぶ:carryする::~
運べる:carryできる:~
運んで:carryして:~
重なっ:overlapし:~
隠す:hideする:~
隠され:hideされ:~
隠し:hideし:~
見積もり:estimate::~
見積もら:estimateさ::~
見積もる:estimateする::~
促す:promptする:~

Cookie:
DoS:denial-of-service:DoS
IANA:
Internet:
TCP:
TLS:
URI:
UTC:

charset:
overhead::::オーバーヘッド
	~~渡る:span:
指図-:instruct:~
account::::アカウント
archive::::アーカイブ
bookmark::::ブックマーク
clear::::クリア
component::::コンポーネント
container:::コンテナ
crash::::クラッシュ
database::::データベース
encapsulate::::カプセル化
encapsulation::::カプセル化
	~err::
folder::::フォルダ
guide::::ガイド
	~hypertext:hypertext note
	key::::キー
log::::ログ
machine::::マシン
mail::::メール
mark::::マーク
memory::::メモリ
email:
句:phrase::~::フレーズ
	pipe-and-filter:パイプ＆フィルタ
property::::プロパティ
	特質
command::::コマンド
random::::ランダム
	render::::レンダー
	rendering::::レンダリング
repository::::リポジトリ
schedule::::スケジュール
table::::テーブル
major::::主:メジャー
minor::::副:マイナー

	●指示語
一定の:certain:~
一時的:temporary:~
余分な:extra:~
今後の:later:~
側:side:~
尾部:trailing:~
頭部:leading:~
末尾:end:~
巨大:large:~
広範:wide:~
広範囲:extensive:~
暫定-:interim:~
最終:final:~
近過去:recent::~
近過去の:recentな::~

重複:duplicate:~
節:section:~
別個:distinct:~

	●仕様
RFC:
framework::::フレームワーク
proprietary::::プロプライエタリ
十分:enough:~
説明d:description:説明
取戻せ:reclaimでき:取り戻せ
取戻され:reclaimされ:取り戻され
導かれ:leadされ:~
導き:leadし:~
導く:leadする:~

扱い:treatment:~
望まず:wishせず:~
回避法:avoidance:~
agent::::エージェント
応用-:apply::~
一般用:general-purpose:~
中立的:neutral:~
	事実:In fact
理由付け:reasoning:~
乏しい:poorな:~
見越す:anticipateする:~
見越して:anticipateして:~
見越され:anticipateされ:~
見越さな:anticipateしな:~
上品:graceful::~
不利:disadvantage:~
不可欠:crucial:~
不明瞭に:obscure:~
保守的:conservative:~
適度:reasonable:~
見合う:reasonableな:~
適応的:adaptive:~
適時:timely:~
有利:advantageous:~
有意度:significance:~
有意性:significance:~
分類上の:categorization:~
利点:advantage:~
利用e:usage:利用
誤用-:misuse:~
濫用:abuse:~
制定-:prescribe:~
上限:limit:~
副次的:secondary:~
創出-:mint:~
非効率:inefficient:~
包括的:comprehensive:~
参照文献:references:~
参考:informative:~
合意:consensus:~
同意-:agree:~
回答:answer:~

損なう:loseする:~
損失:loss:~
対処-:work around:~
対処法:workaround:~
堅牢:robust:~
堅牢性:robustness:~
図:figure:~
増強-:enhance:~
強化-:enhance:~

古い:older:~
可用性:availability:~
不可能:impossible:~
	無効化-／無力化:disable:無効化
同義語:synonym:~
多様:diverse:~
多様性:diversity:~
大概は:presumableに:~
実用性:practicality:~
遂行:performing:~
導入:introduction:~
履行-:fulfill:~
強要-:insist:~
必要十分:adequate:~
必要性:needs:~
恒久的:permanent:~
意向:intention:~
慣行:convention::~
早期の:early:~
明らか:obvious:~
柔軟:flexible:~
柔軟性:flexibility:~
根本的:fundamental:~
	本質的でない:nonessential
権利:right:~
欠如:lack:~
欠如する:lackする:欠く
正した:correctした:~
正され:correctされ:~
手続き:procedure:~
手順:steps:~
抽象化-:abstract 化:~
抽象化:abstraction:~
採用-:adopt:~
採用:adoption:~
推測-:guess:~
推測:guess:~
支援-:assist:~
故意:deliberate:~
方針:strategy:~
深刻:serious:~
準拠-:comply::~
準拠:compliant::~

特性:characteristic:~

位置付け:status:~
相互運用-:interoperate:~

相当:substantial:~
相応しく:suitableで:~

任意選択の:optionalな::~::オプションの
省略可:optional::~::オプション
省略可能:optional::~::オプション
省略可能な:optionalな::~::オプションの
禁制-:prohibit::~
競合-:conflict:~
競合:conflict:~
簡潔:compact:~
精緻化:refinement:~
経験的:heuristic::~::ヒューリスティック
結論-:conclude:~
結論:conclusion:~
統一的:uniform:~
網羅的:exhaustive:~
総集的:collective:~
緩めら:relaxさ:~
緩める:relaxする:~
義務化-:mandate:~
翻訳-:translate::~
翻訳:translation::~
自由:free:~
補助:help:~
複雑化-:complicate:~
表記規約:notational conventions:~
著作者:author:~
機会:chance:~
版:edition:~

設置-:place:~
設置しな:placeしな:課さな
設置する:placeする:課す
診断:diagnostic:~
承認-:acknowledge:~
誤解:mistake:~
責務:responsibility:~
誤解釈:misinterpret:~
性向:nature:~
開示-:disclose:~
開示:disclosure:~
関心:interest:~
限度:extent:~
公共:public:~
表記法:notation:~
解決策:solution:~
英語:English:~
偶発的:accidental:~
偽:false:~
収束-:converge:~
壊す:breakする:~
壊れ:breakされ:~
壊れた:broken:~
理論:theory:~
高度:advance:~
類別:category:~
維持-:retain:~
維持させ:sustainし:~
縛られ:tieされ:~
背後:behind:~
自動:automatic:~
自動化-:automate:~
自動化:automated:~
協調的:collaborative:~
相違化-:differentiate:区別
運用-:operate:~
運用:operation:~
運用者:operator:~
警告:warning::~
警告-:warn::~
組織:organization:~
再試行:retry::~
再試行-:retry::~
	再試行-法:retrying
過度の:excessiveな:~
確約-:assure:~

	:be aware of
	適切でない:inappropriate
	適用すること:application
	認識できない／自身が認識しない:unrecognized

	●保安
私的:private:~:::プライベート
騙す:trickする:~
騙せ:trickでき:~
穴:hole::~::ホール
弱体化-:compromise:~
悪用-:exploit:~
悪用:exploitation:~
害:harm:~
有害:harmful:~
無害:harmless:~
権限:authority::~
権限付与-:authorize::~
権限付与され:authorizeされ::権限が付与され
権限付与:authorization::~
権限的:authoritative::~
認証-:authenticate::~
	認証-済み:authenticated
認証:authentication::~
認証用の:authentication::~
機密性:confidentiality::~
機密的:confidential::~
欠陥:flaw:~
汚染-:poison::~
汚染:poisoning::~
特権拡大:privilege escalation:~
盗聴:theft:~
脆弱:vulnerable::~
署名:signature:~
防御策:defense:~
露呈-:reveal:露わに
経路上の:on-path::~
相関-:correlate:~
相関:correlation:~

	●HTTP／構文／data／stream

hypertext::::ハイパーテキスト
pathname::::パス名
packet::::パケット
payload::::ペイロード
percent::::パーセント
subtag::::下位タグ
trailer::::トレイラ
	trailer節:trailers
chunked:::chunk 化:チャンク化
octet::::オクテット
hex::16 進
hexadecimal::16 進数
asterisk::::アスタリスク
backslash::::バックスラッシュ
chunk::::チャンク
colon::::コロン
comma::::カンマ
	comma区切りの:comma-separated
decimal::10 進
escaping::::エスケープ処理
	引用符~付き:quoted
	~message法:messaging:
	~frame法:framing
二重引用符:double quote::~
区切られ:delimitされ::~
区切り:delimitation::~
区切りの:-separated:~
区切る:delimitする::~
区切子:delimiter::~
分離子:separator:~
合致:match::~::マッチ
実数:real number:~
単数:singleton:::~
桁:digit::~
	構文~上:syntactical
正準-:canonical::~
	正準-化:canonicalization
移行:transition::~
稀:rare:~
番号:number:~
空行:blank line::~
英字:letter::~
圧縮-:compress::~
圧縮:compression::~
下位成分:subcomponent::~
折返-:fold::~
折返さな:foldしな::~
折返し:folding::折り返し
記号:symbol:~
符号化:encoding::~::エンコーディング
	符号化-済み:encoded
符号変換:transcoding::~::トランスコーディング
符号変換器:transcoder::~::トランスコーダ
符号法:coding::~::コーディング
復号:decoding::~::デコーディング
暗号化-:encrypt::~
暗号化:encryption::~
暗号用の:cryptographic::~
形式変換-:transform::~
形式変換:transformation::~
形式変換ng:transforming::形式変換
分割-:split:~
分割:splitting:~
分解-:decompose:~

	●network

challenge::::チャレンジ
digest::::ダイジェスト
hash::::ハッシュ
filter::::フィルタ
firewall::::ファイアウォール
桁溢れ:overflow::~::オーバーフロー
password::::パスワード
	~cache済み:cached
	~cache可能:cacheable
caching:::cache 処理:キャッシュ処理
事前fetch:pre-fetch::事前 fetch
gateway::::ゲートウェイ
内方:inbound::~::インバウンド
外方:outbound::~::アウトバウンド
portal::::ポータル
provider::::プロバイダ
server-wide::server 全般::サーバ全般
spider::::スパイダー
robot::::ロボット
robotic::::ロボット的
transaction::::トランザクション
tunnel::::トンネル
close:
closure:
open:
route::::ルート
	~route法:routing
経路制御:routing::~:ルーティング
direct::::ダイレクト
redirection::::リダイレクト
	ディレクティブ
指令-:direct::~
	directional:
双方向:bidirectional::~
主体:party::~
責任主体:responsible party:~
上流:upstream::~
下流:downstream::~
中継:intermediate::~
中継-:relay::~
中継者:intermediary::~
介在-:intervene:~
伝送処理:transmitting::~
回送-:forward::~
回送:forwarding::~
	回送-法:forwarding
伝送路:wire::~
伝達-:convey::~
分散型の:distributedな::~
到着-:arrive:~
携わる:engageする:~
携わっ:engageし:~
参加者:participant:~
参照元:referring:refer 元:~
受信:receiving::~
受信者:recipient::~
受領:receipt::~
送信者:sender::~
広告-:advertise:~
広告:advertisement:~
往来:round trip:~:::ラウンドトリップ
昇格:upgrade::~::アップグレード
降格:downgrade::~::ダウングレード
端点:endpoint::~::エンドポイント
端点間:end-to-end::~::エンドツーエンド
隣点間:hop-by-hop::~::ホップバイホップ
連絡-:contact:~
連絡:contact:~
連結-:concatenate:~
実体:entity:~
応答class:class:::クラス
応答待ち:outstanding::~

所在-:locate::~
経路:path::~
遠隔:remote::~::リモート

	●未分類
root::::ルート
企業:corporate:~
個人-:personal:~
一掃-:purge:~
不定:indefinite:~
中断:interruption:~

交換:exchange:~
付随-:accompany:~
遊休:idle:~
	遊休~中:idle
proactive::::プロアクティブ
reactive::::リアクティブ
併合-:merge:~
係数:factor:~
促進-:promote:~
保存-:save:~
修正:fix:~
優先度:priority:~
優先順:precedence:~
先行-:precede:~
	共有:shared:~
内来的:inherent:~
冪等:idempotent::~
冪等性:idempotent property::~

出現:appearance:~
出現し:appearし:現れ
出現する:appearする:現れる
出生-:originate::~
出生日時:origination date::~
出生時:origination::~
出生時の:origination::~
分岐:divergent:~
割合:percentage:~
割当-:allocate:~
事前条件:precondition::~
取込まれ:importされ:取り込まれ
同一性:identity:~
同封-:enclose::~
同時:simultaneous:~
同時性:concurrency:~
同時的:concurrent:~
品質:quality::~
品質値:qvalue::~
回復-:recover::~
固定的な:fixed:~
下位型:subtype::~
回復:recovery::~

変更s:changes:変更

外向けの:outgoing:~
失効:expiration:~
失効-:expire:~
弱い:weakな::~
弱さ:weakness::~
強い:strongな::~
強さ:strength::~

検証y-:verify:検証°
検証y:verification:検証°
検証子:validator::~
有効:valid::~
有効性:validity:~
無効化-:invalidate::~
無効化:invalidation::~
容量:capacity:~
対応-:correspond:~
対応ng:corresponding:対応する
	対応付け:mapping:~
対応関係:mappings::~
尚早:premature:~
	局所的な
展開-:expand:~
帯域幅:bandwidth::~::バンド幅
形:form:~
役割:role::~::ロール
後処理:post-processing:~
復帰-:revert:~
所属-:belong:~
所属:belong:~
拒否-:refuse:~
持続-:persist::~
持続性:persistence::~
持続的:persistent::~
給-:supply:~
給せ:supplyでき:~
給さな:supplyしな:~
改変子:modifier::~
族:family::~::ファミリ
日付時刻:date and time::日時
日時:date::~
時刻:time::~
時間制限:timeout::~::タイムアウト
時計:clock::~::クロック
昇順:ascending order:~
降順:decreaseing order:~
更新喪失:lost update::~
条件付き:conditional::~
	〜でない:unconditional~
条態:condition::~
格納域:store::~
再構築-:reconstruct:~
再構築:reconstruction:~
	＊構築し直す
段階:stage:~
活動:activity::~
消去-:erase:~
準備-:prepare:~
状態変更:state-changing::~::ステート変更
stateless::::ステートレス
	無状態の:statelessな:::ステートレスな
	状態を持たない
生の:raw:~
疑似:pseudo:~
発行-:publish:~
発行:publication:~
為す:makeする:~
為され:makeされ:~
為さな:makeしな:~
為して:makeして:~
為した:makeした:~
為せる:makeできる:~
為せな:makeできな:~
	登録-済み:registered
監視器:monitor::~::モニタ
盲目的:blind::~
省略:omit:~
瞬間:moment:~
知覚-:perceive:~
知覚:perception:~

短縮-:shorten:~
種類:kind:~
稼働-:run:~
稼働中の:running:~
算術的:arithmetic:~
算術:arithmetic:~
節約-:save:~
部分範囲:subrange::~
単位:unit:~
終了-:terminate:~
終了:termination:~
結合-:combine:~
結合:combination:~
続行-:proceed:~
計測:measure:~
記憶-:remember:~
	識別-法:identifying
	識別されない:unidentified
	識別-可能:identifyable
負荷:load:~
過負荷:overload:~
超過-:exceed:~
近似:approximation:~
連合-:federate:~
進捗状況:progress:~

演算子:operator:~
過去:past:~
過程:process:~
遭遇-:encounter:~
選定用:selecting::~
被選定:selected::~
選択的:selective::~
選択:choice:~
選択肢:choice:~
	選ぶ／選ばれ／選ん／選べ／ことにする:choice
部位:portion:~
部位t:part::部位
複部位:multipart::~
重み:weight::~
量:amount:~

開く:openする::~
閲覧-:browse:~:::ブラウズ
閲覧:browsing:~:::ブラウジング
隣接点:neighbor::~
領域:region:~
頻繁:frequent:~
鮮度:freshness::~
重合する:overlapする:重なり合う
重合しな:overlapしな:重なり合わな
重合して:overlapして:重なり合って
重合した:overlapした:重なり合った
合体-:coalesce:~

`
/*
	●仕様（他
logging
	文書~化:document
	高い:high
	〜する用意がない:unwilling
	思しきもの:supposedly:
	よって:hence
	何故なら:because
	その時々:on occasion
	~~目的:sake:目的
	おそれ:fear
	が可能になる
	し得ないincapable
	保つ
	年:year
	秒数:seconds
	等しく:equalに
	優先される:precedenceを takeする
	能力を備えている:be capable of
	（〜に備わる能力）
	あり得る／なり得る:potential
	いずれにせよ、:nevertheless
	適切でない:inappropriate
	書いている:writing
	必要がある:have to
	好ましい:preferably
	見込みが高い:likely to
	見込みが低い:not likely to
	〜に従って:-
	いわゆる:a.k.a.
	〜に関係する:in relation to

	●指示語
	一連の:sequence
	〜に従って:-
	より容易に:easier
	なり得る:potential
	1 個以上の:(s)
	〜されたなら、／一度:once
	誰も:anyone
	もたらす／:cause
	いつでも:at any time
	時点:at the time
	いわゆる:a.k.a.
	またがって:acrossして
	またがる:acrossする

	最後に:finally
	最終的:eventual
	先立つ:prior
	〜に先立って／先に／事前に／~~直前:prior to〜
	後続の:subsequent
	次:next
	残りの部分:remainder
	後続-:follow
	前後:around
	そのような:such／:these／...
	全面的に:entirely
	一部分
	一部／部分
	多種多様な:variety
	数種の:several
	の一部:some of
	よく:often
	時には:occasionally
	各所／他所
	沿いにある:along the chain
	逆:reverse
	近い:near
	総:total
	小さな:small

	●動詞
	高める:increaseさせる
	括って:surround
	挙げる:list
	考慮-:regard
	置-
	置く／場所:place
	考え:thinking／suggested
	高める:increaseさせる
	持-:have
	始-／~~開始:begin
	close
	open
	fall
	left
	play
	named
	operate:
	remain
	vary
	-:take
	:tell
	記す／表す:denoteする
	保持-:held
	remain
	応える:meet
	求めに応じて
	行っ
	行われ
	通して渡され:pass through
	あてがう:assignする
	あてがわれ:assignされ
	securedでない:unsecured
	accountable
	actor
	agent駆動の:agent-driven
	render←rendition
	締めくくる:conclude
	say
	seem
	cause
	note
	示-:show
	
	●
	
	量:amount
	類い
	■
	
	unwise
	sequence
	potential
	like
	old
	readily
	respective
	sequence
	
	greater
	long
	missing
	commonly
	draw
	その他の:miscellaneous
	sameness
	through
	事前動作
	受動的
	出来事
	及ぼす
	宛先
	強くstrong
	意図されずに:unintentional
	期間:period／period of time
	源:source:ソース
	表~table
	誤り:wrong
	長く／長い~long
	電網
	一式:set
	〜に利するため:on behalf of
	~~広-:broad／broaden／broader

	＊追加
	~frame法:framing
	~message法:messaging
	~version法:versioning
	〜外:outside
	他方の:one of the two
	種々の:varying
	種々の:variety of
	一連の:sequence
	なり得る:potential
	1 個以上の:(s)
	〜されたなら、／一度:once
	誰も:anyone
	もたらす／:cause
	いつでも:at any time
	時点:at the time
	〜~levelの:〜-level
	〜されたなら、:once
	並び:sequence
	の他に／は別として，:aside from
	変わる:vary
	何故なら:because
	何故:why
	施す:make
	下す:make
	為す:make
	~~行われた:make
	ときには:occasional
	様々になる:vary
	二重に:a second time
	一連の:a series of
	回数:the number of times
	要する:requireする
	のように:as in the
	一連の:successive
	先立つ:prior
	各部:parts

●●

*/