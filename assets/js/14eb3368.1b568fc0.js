"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[46969],{95303:(e,t,n)=>{n.d(t,{A:()=>O});var r=n(96540),a=n(20053),i=n(76514),c=n(10563),o=n(38232),l=n(2775),s=n(6490),m=n(53040);function u(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function d(e){return r.createElement("svg",function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),r.forEach((function(t){u(e,t,n[t])}))}return e}({viewBox:"0 0 24 24"},e),r.createElement("path",{d:"M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z",fill:"currentColor"}))}const b={breadcrumbHomeIcon:"breadcrumbHomeIcon_YNFT"};function p(){const e=(0,m.A)("/");return r.createElement("li",{className:"breadcrumbs__item"},r.createElement(l.A,{"aria-label":(0,s.T)({id:"theme.docs.breadcrumbs.home",message:"Home page",description:"The ARIA label for the home page in the breadcrumbs"}),className:"breadcrumbs__link",href:e},r.createElement(d,{className:b.breadcrumbHomeIcon})))}const f={breadcrumbsContainer:"breadcrumbsContainer_Z_bl"};function h(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function g(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))})),e}function v({children:e,href:t,isLast:n}){const a="breadcrumbs__link";return n?r.createElement("span",{className:a,itemProp:"name"},e):t?r.createElement(l.A,{className:a,href:t,itemProp:"item"},r.createElement("span",{itemProp:"name"},e)):r.createElement("span",{className:a},e)}function y({children:e,active:t,index:n,addMicrodata:i}){return r.createElement("li",g(function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),r.forEach((function(t){h(e,t,n[t])}))}return e}({},i&&{itemScope:!0,itemProp:"itemListElement",itemType:"https://schema.org/ListItem"}),{className:(0,a.A)("breadcrumbs__item",{"breadcrumbs__item--active":t})}),e,r.createElement("meta",{itemProp:"position",content:String(n+1)}))}function O(){const e=(0,c.OF)(),t=(0,o.Dt)();return e?r.createElement("nav",{className:(0,a.A)(i.G.docs.docBreadcrumbs,f.breadcrumbsContainer),"aria-label":(0,s.T)({id:"theme.docs.breadcrumbs.navAriaLabel",message:"Breadcrumbs",description:"The ARIA label for the breadcrumbs"})},r.createElement("ul",{className:"breadcrumbs",itemScope:!0,itemType:"https://schema.org/BreadcrumbList"},t&&r.createElement(p,null),e.map(((t,n)=>{const a=n===e.length-1;return r.createElement(y,{key:n,active:a,index:n,addMicrodata:!!t.href},r.createElement(v,{href:t.href,isLast:a},t.label))})))):null}},1503:(e,t,n)=>{n.r(t),n.d(t,{default:()=>k});var r=n(96540),a=n(64475),i=n(10563),c=n(53040),o=n(20053),l=n(2775),s=n(99185),m=n(6490);const u={cardContainer:"cardContainer_fWXF",cardTitle:"cardTitle_rnsV",cardDescription:"cardDescription_PWke"};function d({href:e,children:t}){return r.createElement(l.A,{href:e,className:(0,o.A)("card padding--lg",u.cardContainer)},t)}function b({href:e,icon:t,title:n,description:a}){return r.createElement(d,{href:e},r.createElement("h2",{className:(0,o.A)("text--truncate",u.cardTitle),title:n},t," ",n),a&&r.createElement("p",{className:(0,o.A)("text--truncate",u.cardDescription),title:a},a))}function p({item:e}){const t=(0,i._o)(e);return t?r.createElement(b,{href:t,icon:"\ud83d\uddc3\ufe0f",title:e.label,description:null!==(n=e.description)&&void 0!==n?n:(0,m.T)({message:"{count} items",id:"theme.docs.DocCard.categoryDescription",description:"The default description for a category card in the generated index about how many items this category includes"},{count:e.items.length})}):null;var n}function f({item:e}){const t=(0,s.A)(e.href)?"\ud83d\udcc4\ufe0f":"\ud83d\udd17";var n;const a=(0,i.cC)(null!==(n=e.docId)&&void 0!==n?n:void 0);var c;return r.createElement(b,{href:e.href,icon:t,title:e.label,description:null!==(c=e.description)&&void 0!==c?c:null==a?void 0:a.description})}function h({item:e}){switch(e.type){case"link":return r.createElement(f,{item:e});case"category":return r.createElement(p,{item:e});default:throw new Error(`unknown item type ${JSON.stringify(e)}`)}}function g({className:e}){const t=(0,i.$S)();return r.createElement(v,{items:t.items,className:e})}function v(e){const{items:t,className:n}=e;if(!t)return r.createElement(g,e);const a=(0,i.d1)(t);return r.createElement("section",{className:(0,o.A)("row",n)},a.map(((e,t)=>r.createElement("article",{key:t,className:"col col--6 margin-bottom--lg"},r.createElement(h,{item:e})))))}var y=n(73510),O=n(73371),E=n(1888),j=n(95303),w=n(49034);const P={generatedIndexPage:"generatedIndexPage_vN6x",list:"list_eTzJ",title:"title_kItE"};function N({categoryGeneratedIndex:e}){return r.createElement(a.be,{title:e.title,description:e.description,keywords:e.keywords,image:(0,c.A)(e.image)})}function A({categoryGeneratedIndex:e}){const t=(0,i.$S)();return r.createElement("div",{className:P.generatedIndexPage},r.createElement(O.A,null),r.createElement(j.A,null),r.createElement(E.A,null),r.createElement("header",null,r.createElement(w.A,{as:"h1",className:P.title},e.title),e.description&&r.createElement("p",null,e.description)),r.createElement("article",{className:"margin-top--lg"},r.createElement(v,{items:t.items,className:P.list})),r.createElement("footer",{className:"margin-top--lg"},r.createElement(y.A,{previous:e.navigation.previous,next:e.navigation.next})))}function k(e){return r.createElement(r.Fragment,null,r.createElement(N,e),r.createElement(A,e))}},73510:(e,t,n)=>{n.d(t,{A:()=>s});var r=n(96540),a=n(6490),i=n(92711);function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),r.forEach((function(t){c(e,t,n[t])}))}return e}function l(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))})),e}function s(e){const{previous:t,next:n}=e;return r.createElement("nav",{className:"pagination-nav docusaurus-mt-lg","aria-label":(0,a.T)({id:"theme.docs.paginator.navAriaLabel",message:"Docs pages",description:"The ARIA label for the docs pagination"})},t&&r.createElement(i.A,l(o({},t),{subLabel:r.createElement(a.A,{id:"theme.docs.paginator.previous",description:"The label used to navigate to the previous doc"},"Previous")})),n&&r.createElement(i.A,l(o({},n),{subLabel:r.createElement(a.A,{id:"theme.docs.paginator.next",description:"The label used to navigate to the next doc"},"Next"),isNext:!0})))}},1888:(e,t,n)=>{n.d(t,{A:()=>l});var r=n(96540),a=n(20053),i=n(6490),c=n(76514),o=n(82175);function l({className:e}){const t=(0,o.r)();return t.badge?r.createElement("span",{className:(0,a.A)(e,c.G.docs.docVersionBadge,"badge badge--secondary")},r.createElement(i.A,{id:"theme.docs.versionBadge.label",values:{versionLabel:t.label}},"Version: {versionLabel}")):null}},73371:(e,t,n)=>{n.d(t,{A:()=>h});var r=n(96540),a=n(20053),i=n(31243),c=n(2775),o=n(6490),l=n(49354),s=n(76514),m=n(86e3),u=n(82175);const d={unreleased:function({siteTitle:e,versionMetadata:t}){return r.createElement(o.A,{id:"theme.docs.versions.unreleasedVersionLabel",description:"The label used to tell the user that he's browsing an unreleased doc version",values:{siteTitle:e,versionLabel:r.createElement("b",null,t.label)}},"This is unreleased documentation for {siteTitle} {versionLabel} version.")},unmaintained:function({siteTitle:e,versionMetadata:t}){return r.createElement(o.A,{id:"theme.docs.versions.unmaintainedVersionLabel",description:"The label used to tell the user that he's browsing an unmaintained doc version",values:{siteTitle:e,versionLabel:r.createElement("b",null,t.label)}},"This is documentation for {siteTitle} {versionLabel}, which is no longer actively maintained.")}};function b(e){const t=d[e.versionMetadata.banner];return r.createElement(t,e)}function p({versionLabel:e,to:t,onClick:n}){return r.createElement(o.A,{id:"theme.docs.versions.latestVersionSuggestionLabel",description:"The label used to tell the user to check the latest version",values:{versionLabel:e,latestVersionLink:r.createElement("b",null,r.createElement(c.A,{to:t,onClick:n},r.createElement(o.A,{id:"theme.docs.versions.latestVersionLinkLabel",description:"The label used for the latest version suggestion link label"},"latest version")))}},"For up-to-date documentation, see the {latestVersionLink} ({versionLabel}).")}function f({className:e,versionMetadata:t}){const{siteConfig:{title:n}}=(0,i.A)(),{pluginId:c}=(0,l.vT)({failfast:!0}),{savePreferredVersionName:o}=(0,m.g1)(c),{latestDocSuggestion:u,latestVersionSuggestion:d}=(0,l.HW)(c),f=null!=u?u:(h=d).docs.find((e=>e.id===h.mainDocId));var h;return r.createElement("div",{className:(0,a.A)(e,s.G.docs.docVersionBanner,"alert alert--warning margin-bottom--md"),role:"alert"},r.createElement("div",null,r.createElement(b,{siteTitle:n,versionMetadata:t})),r.createElement("div",{className:"margin-top--md"},r.createElement(p,{versionLabel:d.label,to:f.path,onClick:()=>o(d.name)})))}function h({className:e}){const t=(0,u.r)();return t.banner?r.createElement(f,{className:e,versionMetadata:t}):null}},49034:(e,t,n)=>{n.d(t,{A:()=>b});var r=n(96540),a=n(20053),i=n(6490),c=n(22945),o=n(2775);const l={anchorWithStickyNavbar:"anchorWithStickyNavbar_LWe7",anchorWithHideOnScrollNavbar:"anchorWithHideOnScrollNavbar_WYt5"};function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function m(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),r.forEach((function(t){s(e,t,n[t])}))}return e}function u(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))})),e}function d(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}function b(e){var{as:t,id:n}=e,s=d(e,["as","id"]);const{navbar:{hideOnScroll:b}}=(0,c.p)();if("h1"===t||!n)return r.createElement(t,u(m({},s),{id:void 0}));const p=(0,i.T)({id:"theme.common.headingLinkTitle",message:"Direct link to {heading}",description:"Title for link to heading"},{heading:"string"==typeof s.children?s.children:n});return r.createElement(t,u(m({},s),{className:(0,a.A)("anchor",b?l.anchorWithHideOnScrollNavbar:l.anchorWithStickyNavbar,s.className),id:n}),s.children,r.createElement(o.A,{className:"hash-link",to:`#${n}`,"aria-label":p,title:p},"\u200b"))}},92711:(e,t,n)=>{n.d(t,{A:()=>c});var r=n(96540),a=n(20053),i=n(2775);function c(e){const{permalink:t,title:n,subLabel:c,isNext:o}=e;return r.createElement(i.A,{className:(0,a.A)("pagination-nav__link",o?"pagination-nav__link--next":"pagination-nav__link--prev"),to:t},c&&r.createElement("div",{className:"pagination-nav__sublabel"},c),r.createElement("div",{className:"pagination-nav__label"},n))}}}]);