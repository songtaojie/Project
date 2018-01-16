if(typeof(LigerUIManagers)=="undefined"){LigerUIManagers={}}(function(A){A.fn.ligerGetTreeManager=function(){return LigerUIManagers[this[0].id+"_Tree"]};A.fn.ligerRemoveTreeManager=function(){return this.each(function(){LigerUIManagers[this.id+"_Tree"]=null})};A.fn.ligerTree=function(B){return this.each(function(){B=A.extend({url:null,data:null,checkbox:true,autoCheckboxEven:true,parentIcon:"folder",childIcon:"leaf",textFieldName:"text",attribute:["id","url"],nodeWidth:70,onBeforeExpand:null,onExpand:null,onBeforeCollapse:null,onCollapse:null,onBeforeSelect:null,onSelect:null,onBeforeCancelSelect:null,onCancelselect:null,onCheck:null,onSuccess:null,onError:null,onClick:null},B||{});if(this.usedTree){return}if(A(this).hasClass("l-hidden")){return}var D={getData:function(){return D.data},hasChildren:function(E){return A("> ul",E).length>0},getParentTreeItem:function(F,I){var G=A(F);if(G.parent().hasClass("l-tree")){return null}if(I==undefined){if(G.parent().parent("li").length==0){return null}return G.parent().parent("li")[0]}var E=parseInt(G.attr("outlinelevel"));var H=G;for(var J=E-1;J>=I;J--){H=H.parent().parent("li")}return H[0]},getChecked:function(){if(!B.checkbox){return null}var E=[];A(".l-checkbox-checked",D.tree).parent().parent("li").each(function(){var F=parseInt(A(this).attr("treedataindex"));E.push({target:this,data:C.getDataNodeByTreeDataIndex(D.data,F)})});return E},getSelected:function(){var F={};F.target=A(".l-selected",D.tree).parent("li")[0];if(F.target){var E=parseInt(A(F.target).attr("treedataindex"));F.data=C.getDataNodeByTreeDataIndex(D.data,E);return F}return null},upgrade:function(E){A(".l-note",E).each(function(){A(this).removeClass("l-note").addClass("l-expandable-open")});A(".l-note-last",E).each(function(){A(this).removeClass("l-note-last").addClass("l-expandable-open")});A("."+C.getChildNodeClassName(),E).each(function(){A(this).removeClass(C.getChildNodeClassName()).addClass(C.getParentNodeClassName(true))})},demotion:function(F){if(!F&&F[0].tagName.toLowerCase()!="li"){return}var E=A(F).hasClass("l-last");A(".l-expandable-open",F).each(function(){A(this).removeClass("l-expandable-open").addClass(E?"l-note-last":"l-note")});A(".l-expandable-close",F).each(function(){A(this).removeClass("l-expandable-close").addClass(E?"l-note-last":"l-note")});A("."+C.getParentNodeClassName(true),F).each(function(){A(this).removeClass(C.getParentNodeClassName(true)).addClass(C.getChildNodeClassName())})},collapseAll:function(){A(".l-expandable-open",D.tree).click()},expandAll:function(){A(".l-expandable-close",D.tree).click()},loadData:function(G,F,E){D.loading.show();E=E||{};A.ajax({type:"post",url:F,data:E,dataType:"json",success:function(H){D.loading.hide();D.append(G,H);if(B.onSuccess){B.onSuccess(H)}},error:function(I,H,J){try{D.loading.hide();if(B.onError){B.onError(I,H,J)}}catch(K){}}})},clear:function(){A("> li",D.tree).each(function(){D.remove(this)})},remove:function(E){var H=parseInt(A(E).attr("treedataindex"));var F=C.getDataNodeByTreeDataIndex(D.data,H);if(F){C.setTreeDataStatus([F],"delete")}var I=D.getParentTreeItem(E);if(B.checkbox){A(".l-checkbox",E).remove();C.setParentCheckboxStatus(A(E))}A(E).remove();if(I==null){I=D.tree.parent()}var G=A("> ul > li",I).length;if(G>0){A("> ul > li",I).each(function(J,K){if(J==0&&!A(this).hasClass("l-first")){A(this).addClass("l-first")}if(J==G-1&&!A(this).hasClass("l-last")){A(this).addClass("l-last")}if(J==0&&J==G-1&&!A(this).hasClass("l-onlychild")){A(this).addClass("l-onlychild")}A("> div .l-note,> div .l-note-last",this).removeClass("l-note l-note-last").addClass(J==G-1?"l-note-last":"l-note");C.setTreeItem(this,{isLast:J==G-1})})}else{}},append:function(J,H){if(!H||!H.length){return false}C.addTreeDataIndexToData(H);C.setTreeDataStatus(H,"add");C.appendData(J,H);data=H;if(!J){if(A("> li:last",D.tree).length>0){C.setTreeItem(A("> li:last",D.tree)[0],{isLast:false})}var E=A("> li",D.tree).length;A("> li",A(C.getTreeHTML(data))).appendTo(D.tree);var G=A("> li",D.tree).length;A("> li",D.tree).each(function(L,M){if(L<=E-1){return}C.initTreeItem(A(this),1,L==0,L==G-1)});return}var I=A(J);var F=parseInt(I.attr("outlinelevel"));var K=A("> ul",I).length>0;if(!K){I.append("<ul class='l-children'></ul>");D.upgrade(J)}if(A("> .l-children > li:last",I).length>0){C.setTreeItem(A("> .l-children > li:last",I)[0],{isLast:false})}var E=A("> ul > li",I).length;A("> li",A(C.getTreeHTML(data))).appendTo(A("> ul",I));var G=A("> ul > li",I).length;A("> ul > li",I).each(function(L,M){if(L<=E-1){return}C.initTreeItem(A(this),F+1,L==0,L==G-1)});C.upadteTreeWidth()}};var C={getDataNodeByTreeDataIndex:function(H,G){for(var E=0;E<H.length;E++){if(H[E].treedataindex==G){return H[E]}if(H[E].children){var F=C.getDataNodeByTreeDataIndex(H[E].children,G);if(F){return F}}}return null},setTreeDataStatus:function(F,E){A(F).each(function(){this.__status=E;if(this.children){C.setTreeDataStatus(this.children,E)}})},addTreeDataIndexToData:function(E){A(E).each(function(){if(this.treedataindex!=undefined){return}this.treedataindex=D.treedataindex++;if(this.children){C.addTreeDataIndexToData(this.children)}})},appendData:function(E,H){var G=parseInt(A(E).attr("treedataindex"));var F=C.getDataNodeByTreeDataIndex(D.data,G);if(D.treedataindex==undefined){D.treedataindex=0}if(F&&F.children==undefined){F.children=[]}A(H).each(function(I,J){if(F){F.children[F.children.length]=A.extend({},J)}else{D.data[D.data.length]=A.extend({},J)}})},setTreeItem:function(F,H){if(!H){return}var G=A(F);var E=parseInt(G.attr("outlinelevel"));if(H.isLast!=undefined){if(H.isLast==true){G.removeClass("l-last").addClass("l-last");A("> div .l-note",G).removeClass("l-note").addClass("l-note-last");A(".l-children li",G).find(".l-box:eq("+(E-1)+")").removeClass("l-line")}else{if(H.isLast==false){G.removeClass("l-last");A("> div .l-note-last",G).removeClass("l-note-last").addClass("l-note");A(".l-children li",G).find(".l-box:eq("+(E-1)+")").removeClass("l-line").addClass("l-line")}}}},getTreeHTML:function(H){var E="<ul class='l-children'>";for(var F=0;F<H.length;F++){E+="<li ";if(H[F].treedataindex!=undefined){E+='treedataindex="'+H[F].treedataindex+'" '}if(H[F].isexpand!=undefined){E+="isexpand="+H[F].isexpand+" "}for(var G=0;G<B.attribute.length;G++){if(H[F][B.attribute[G]]){E+=B.attribute[G]+'="'+H[F][B.attribute[G]]+'" '}}E+=">";E+="<span>"+H[F].text+"</span>";if(H[F].children){E+=C.getTreeHTML(H[F].children)}E+="</li>"}E+="</ul>";return E},upadteTreeWidth:function(){if(!D.maxOutlineLevel){D.maxOutlineLevel=1}var E=D.maxOutlineLevel*22;if(B.checkbox){E+=22}if(B.parentIcon||B.childIcon){E+=22}E+=B.nodeWidth;D.tree.width(E)},getChildNodeClassName:function(){return"l-tree-icon-"+B.childIcon},getParentNodeClassName:function(E){var F="l-tree-icon-"+B.parentIcon;if(E){F+="-open"}return F},applyTree:function(){var E=A("> li",D.tree).length;if(E==0){return}A("> li",D.tree).each(function(H,I){var G=D.data.length;D.data[G]={text:A("> span,> a",this).text(),treedataindex:D.treedataindex++};for(var F=0;F<B.attribute.length;F++){if(A(this).attr(B.attribute[F])){D.data[G][B.attribute[F]]=A(this).attr(B.attribute[F])}}C.initTreeItem(A(this),1,H==0,H==E-1,D.data[G])});C.upadteTreeWidth()},applyTreeEven:function(E){A("> .l-body",E).hover(function(){A(this).addClass("l-over")},function(){A(this).removeClass("l-over")})},setTreeEven:function(){D.tree.click(function(H){var I=(H.target||H.srcElement);var F=null;if(I.tagName.toLowerCase()=="a"||I.tagName.toLowerCase()=="span"||A(I).hasClass("l-box")){F=A(I).parent().parent()}else{if(A(I).hasClass("l-body")){F=A(I).parent()}else{F=A(I)}}if(!F){return}var G=parseInt(F.attr("treedataindex"));var E=C.getDataNodeByTreeDataIndex(D.data,G);if(!A(I).hasClass("l-expandable-open")&&!A(I).hasClass("l-expandable-close")){if(A(">div:first",F).hasClass("l-selected")){if(B.onBeforeCancelSelect&&B.onBeforeCancelSelect({data:E,target:F[0]})==false){return false}A(">div:first",F).removeClass("l-selected");B.onCancelSelect&&B.onCancelSelect({data:E,target:F[0]})}else{if(B.onBeforeSelect&&B.onBeforeSelect({data:E,target:F[0]})==false){return false}A(".l-body",D.tree).removeClass("l-selected");A(">div:first",F).addClass("l-selected");B.onSelect&&B.onSelect({data:E,target:F[0]})}}if(A(I).hasClass("l-expandable-open")){if(B.onBeforeCollapse&&B.onBeforeCollapse({data:E,target:F[0]})==false){return false}A(I).removeClass("l-expandable-open").addClass("l-expandable-close");A("> .l-children",F).slideToggle("fast");A("> div ."+C.getParentNodeClassName(true),F).removeClass(C.getParentNodeClassName(true)).addClass(C.getParentNodeClassName());B.onCollapse&&B.onCollapse({data:E,target:F[0]})}else{if(A(I).hasClass("l-expandable-close")){if(B.onBeforeExpand&&B.onBeforeExpand({data:E,target:F[0]})==false){return false}A(I).removeClass("l-expandable-close").addClass("l-expandable-open");A("> .l-children",F).slideToggle("fast",function(){B.onExpand&&B.onExpand({data:E,target:F[0]})});A("> div ."+C.getParentNodeClassName(),F).removeClass(C.getParentNodeClassName()).addClass(C.getParentNodeClassName(true))}else{if(A(I).hasClass("l-checkbox")&&B.autoCheckboxEven){if(A(I).hasClass("l-checkbox-unchecked")){A(I).removeClass("l-checkbox-unchecked").addClass("l-checkbox-checked");A(".l-children .l-checkbox",F).removeClass("l-checkbox-incomplete l-checkbox-unchecked").addClass("l-checkbox-checked");B.onCheck&&B.onCheck({data:E,target:F[0]},true)}else{if(A(I).hasClass("l-checkbox-checked")){A(I).removeClass("l-checkbox-checked").addClass("l-checkbox-unchecked");A(".l-children .l-checkbox",F).removeClass("l-checkbox-incomplete l-checkbox-checked").addClass("l-checkbox-unchecked");B.onCheck&&B.onCheck({data:E,target:F[0]},false)}else{if(A(I).hasClass("l-checkbox-incomplete")){A(I).removeClass("l-checkbox-incomplete").addClass("l-checkbox-checked");A(".l-children .l-checkbox",F).removeClass("l-checkbox-incomplete l-checkbox-unchecked").addClass("l-checkbox-checked");B.onCheck&&B.onCheck({data:E,target:F[0]},true)}}}C.setParentCheckboxStatus(F)}}}B.onClick&&B.onClick({data:E,target:F[0]})})},setParentCheckboxStatus:function(G){var F=A(".l-checkbox-unchecked",G.parent()).length==0;var E=A(".l-checkbox-checked",G.parent()).length==0;if(F){G.parent().prev().find(".l-checkbox").removeClass("l-checkbox-unchecked l-checkbox-incomplete").addClass("l-checkbox-checked")}else{if(E){G.parent().prev().find("> .l-checkbox").removeClass("l-checkbox-checked l-checkbox-incomplete").addClass("l-checkbox-unchecked")}else{G.parent().prev().find("> .l-checkbox").removeClass("l-checkbox-unchecked l-checkbox-checked").addClass("l-checkbox-incomplete")}}if(G.parent().parent("li").length>0){C.setParentCheckboxStatus(G.parent().parent("li"))}},initTreeItem:function(F,E,G,M,I){if(F.attr("outlinelevel")){return}if(!D.maxOutlineLevel||D.maxOutlineLevel<E){D.maxOutlineLevel=E}F.attr("outlinelevel",E);if(I&&I.treedataindex!=undefined&&!F.attr("treedataindex")){F.attr("treedataindex",I.treedataindex)}var H=F.attr("isexpand");if(G&&!F.hasClass("l-first")){F.addClass("l-first")}if(M&&!F.hasClass("l-last")){F.addClass("l-last")}if(G&&M&&!F.hasClass("l-onlychild")){F.addClass("l-onlychild")}A("> span,> a",F).wrap("<div></div>");if(!A("> div",F).hasClass("l-body")){A("> div",F).addClass("l-body")}if(D.hasChildren(F[0])){if(B.parentIcon){A("> div",F).prepend('<div class="l-box '+C.getParentNodeClassName(true)+'"></div>')}if(B.checkbox){A("> div",F).prepend('<div class="l-box l-checkbox l-checkbox-unchecked"></div>')}A("> div",F).prepend('<div class="l-box l-expandable-open"></div>');var K=A("> ul > li",F).length;if(!A("> ul",F).hasClass("l-children")){A("> ul",F).addClass("l-children")}if(I&&I.children==undefined){I.children=[]}A("> ul > li",F).each(function(P,Q){if(I){var O=I.children.length;I.children[O]={text:A("> span,> a",this).text(),treedataindex:D.treedataindex++};for(var N=0;N<B.attribute.length;N++){if(A(this).attr(B.attribute[N])){I.children[O][B.attribute[N]]=A(this).attr(B.attribute[N])}}C.initTreeItem(A(this),E+1,P==0,P==K-1,I.children[O])}else{C.initTreeItem(A(this),E+1,P==0,P==K-1)}})}else{if(B.childIcon){A("> div",F).prepend('<div class="l-box '+C.getChildNodeClassName()+'"></div>')}if(B.checkbox){A("> div",F).prepend('<div class="l-box l-checkbox l-checkbox-unchecked"></div>')}if(M){A("> div",F).prepend('<div class="l-box l-note-last"></div>')}else{A("> div",F).prepend('<div class="l-box l-note"></div>')}}for(var L=E-1;L>=1;L--){var J=A(D.getParentTreeItem(F[0],L));if(J.hasClass("l-last")){A("> div",F).prepend('<div class="l-box"></div>')}else{A("> div",F).prepend('<div class="l-box l-line"></div>')}}if(D.hasChildren(F[0])&&H!=undefined&&(H=="false"||H==false)){A("> div .l-expandable-open",F).removeClass("l-expandable-open").addClass("l-expandable-close");A("> .l-children",F).hide();A("> div ."+C.getParentNodeClassName(true),F).removeClass(C.getParentNodeClassName(true)).addClass(C.getParentNodeClassName())}if(A(F).hasClass("l-expandable-open")){A("> .l-children",F).show()}else{if(A(this).hasClass("l-expandable-close")){A("> .l-children",F).hide()}}C.applyTreeEven(F[0])}};if(!A(this).hasClass("l-tree")){A(this).addClass("l-tree")}D.tree=A(this);D.loading=A("<div class='l-tree-loading'></div>");D.tree.after(D.loading);D.data=[];D.treedataindex=0;C.applyTree();C.setTreeEven();if(B.data){D.append(null,B.data)}if(B.url){D.loadData(null,B.url)}if(this.id==undefined||this.id==""){this.id="LigerUI_"+new Date().getTime()}LigerUIManagers[this.id+"_Tree"]=D;this.usedTree=true})}})(jQuery);