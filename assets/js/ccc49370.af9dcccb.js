"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[83249],{37139:(e,t,n)=>{n.r(t),n.d(t,{default:()=>O});var r=n(96540),o=n(20053),a=n(64475),l=n(76514),c=n(34854),i=n(33154),s=n(38047),p=n(6490),m=n(92711);function b(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function u(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),r.forEach((function(t){b(e,t,n[t])}))}return e}function g(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))})),e}function d(e){const{nextItem:t,prevItem:n}=e;return r.createElement("nav",{className:"pagination-nav docusaurus-mt-lg","aria-label":(0,p.T)({id:"theme.blog.post.paginator.navAriaLabel",message:"Blog post page navigation",description:"The ARIA label for the blog posts pagination"})},n&&r.createElement(m.A,g(u({},n),{subLabel:r.createElement(p.A,{id:"theme.blog.post.paginator.newerPost",description:"The blog post button label to navigate to the newer/previous post"},"Newer Post")})),t&&r.createElement(m.A,g(u({},t),{subLabel:r.createElement(p.A,{id:"theme.blog.post.paginator.olderPost",description:"The blog post button label to navigate to the older/next post"},"Older Post"),isNext:!0})))}function f(){const{assets:e,metadata:t}=(0,c.e)(),{title:n,description:o,date:l,tags:i,authors:s,frontMatter:p}=t,{keywords:m}=p;var b;const u=null!==(b=e.image)&&void 0!==b?b:p.image;return r.createElement(a.be,{title:n,description:o,keywords:m,image:u},r.createElement("meta",{property:"og:type",content:"article"}),r.createElement("meta",{property:"article:published_time",content:l}),s.some((e=>e.url))&&r.createElement("meta",{property:"article:author",content:s.map((e=>e.url)).filter(Boolean).join(",")}),i.length>0&&r.createElement("meta",{property:"article:tag",content:i.map((e=>e.label)).join(",")}))}var y=n(54522);function h({sidebar:e,children:t}){const{metadata:n,toc:o}=(0,c.e)(),{nextItem:a,prevItem:l,frontMatter:p}=n,{hide_table_of_contents:m,toc_min_heading_level:b,toc_max_heading_level:u}=p;return r.createElement(i.A,{sidebar:e,toc:!m&&o.length>0?r.createElement(y.A,{toc:o,minHeadingLevel:b,maxHeadingLevel:u}):void 0},r.createElement(s.A,null,t),(a||l)&&r.createElement(d,{nextItem:a,prevItem:l}))}function O(e){const t=e.content;return r.createElement(c.i,{content:e.content,isBlogPostPage:!0},r.createElement(a.e3,{className:(0,o.A)(l.G.wrapper.blogPages,l.G.page.blogPostPage)},r.createElement(f,null),r.createElement(h,{sidebar:e.sidebar},r.createElement(t,null))))}}}]);