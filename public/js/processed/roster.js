function _readOnlyError(e){throw new Error('"'+e+'" is read-only')}var table=null,colName=0,colPrios=1,colWishlist=2,colLoot=3,colRecipes=4,colRoles=5,colNotes=6,colClass=7,colRaidGroup=8,colRaidsAttended=11,allItemsVisible=!1,strikethroughVisible=!0,offspecVisible=!0;function createTable(){return rosterTable=$("#characterTable").DataTable({autoWidth:!1,data:characters,columns:[{title:'<span class="fas fa-fw fa-user"></span> '.concat(headerCharacter,' <span class="text-muted small">(').concat(characters.length,")</span>"),data:"character",render:function render(e,t,a){return'\n                    <ul class="no-bullet no-indent mb-2">\n                        <li>\n                            <div class="dropdown text-'.concat(a.class?a.class.toLowerCase():"",'">\n                                <a class="dropdown-toggle text-4 font-weight-bold text-').concat(a.class?a.class.toLowerCase():"",'"\n                                    id="character').concat(a.id,'Dropdown"\n                                    role="button"\n                                    data-toggle="dropdown"\n                                    aria-haspopup="true"\n                                    aria-expanded="false"\n                                    title="').concat(a.username?a.username:"",'">\n                                    ').concat(a.name,'\n                                </a>\n                                <div class="dropdown-menu" aria-labelledby="character').concat(a.id,'Dropdown">\n                                    <a class="dropdown-item" href="/').concat(guild.id,"/").concat(guild.slug,"/c/").concat(a.id,"/").concat(a.slug,'">Profile</a>\n                                    <a class="dropdown-item" href="/').concat(guild.id,"/").concat(guild.slug,"/audit-log?character_id=").concat(a.id,'">History</a>\n                                    ').concat(showEdit?'<a class="dropdown-item" href="/'.concat(guild.id,"/").concat(guild.slug,"/c/").concat(a.id,"/").concat(a.slug,'/edit">Edit</a>\n                                        <a class="dropdown-item" href="/').concat(guild.id,"/").concat(guild.slug,"/c/").concat(a.id,"/").concat(a.slug,'/loot">Wishlist & Loot</a>'):"","\n                                    ").concat(a.member_id?'<a class="dropdown-item" href="/'.concat(guild.id,"/").concat(guild.slug,"/u/").concat(a.member_id,"/").concat(a.username?a.username.toLowerCase():"view member",'">').concat(a.username?a.username:"view member","</a>"):"","\n                                </div>\n                            </div>\n                        </li>\n                        ").concat(a.is_alt||a.raid_group_name||a.class?"\n                            <li>\n                                ".concat(a.is_alt?'\n                                    <span class="text-warning font-weight-bold">'.concat(localeAlt,"</span>&nbsp;\n                                "):"","\n                                ").concat(a.raid_group_name?'\n                                    <span class="font-weight-bold d-inline tag">\n                                        <span class="role-circle" style="background-color:'.concat(getColorFromDec(parseInt(a.raid_group_color)),'"></span>\n                                        ').concat(a.raid_group_name?a.raid_group_name:"","\n                                    </span>&nbsp;\n                                "):"","\n                                ").concat(a.class?a.class:"","\n                            </li>"):"","\n\n                        ").concat(guild.is_attendance_hidden||!a.attendance_percentage&&!a.raid_count?"":"<li>\n                                ".concat(a.raid_count&&"number"==typeof a.attendance_percentage?'<span title="attendance" class="'.concat(getAttendanceColor(a.attendance_percentage),'">').concat(Math.round(100*a.attendance_percentage),"%</span>"):"","\n                                ").concat(a.raid_count?'<span class="small text-muted">'.concat(a.raid_count," raid").concat(a.raid_count>1?"s":"","</span>"):"","\n                            </li>"),"\n\n                        ").concat(a.level||a.race||a.spec?'\n                            <li>\n                                <span class="small text-muted">\n                                    '.concat(a.level?a.level:"",'\n                                    <span class="font-weight-bold">\n                                        ').concat(a.race?a.race:"","\n                                        ").concat(a.spec?a.spec:"","\n                                    </span>\n                                </span>\n                            </li>"):"","\n\n                        ").concat(a.rank||a.profession_1||a.profession_2?'\n                            <li>\n                                <span class="small text-muted">\n                                    '.concat(a.rank?"Rank "+a.rank+(a.profession_1||a.profession_2?",":""):"","\n                                    ").concat(a.profession_1?a.profession_1+(a.profession_2?",":""):"","\n                                    ").concat(a.profession_2?a.profession_2:"","\n                                </span>\n                            </li>"):"","\n                        ").concat(showEdit?"\n                            ".concat(a.is_received_unlocked?'<li class="list-inline-item small text-warning" title="To lock, edit the member that owns this character">loot unlocked</li>':"","\n                            ").concat(a.is_wishlist_unlocked?'<li class="list-inline-item small text-warning" title="To lock, edit the member that owns this character">wishlist unlocked</li>':"","\n                            "):"","\n                    </ul>")},visible:!0,width:"250px",className:"width-250"},{title:'<span class="text-gold fas fa-fw fa-sort-amount-down"></span> '.concat(headerPrios),data:"prios",render:function render(e,t,a){return e&&e.length?getItemListHtml(e,"prio",a.id,!0):"—"},orderable:!1,visible:!!showPrios,width:"280px",className:"width-280"},{title:'<span class="text-legendary fas fa-fw fa-scroll-old"></span> '.concat(headerWishlist,'\n                    <span class="js-sort-wishlists text-link">\n                        <span class="fas fa-fw fa-exchange cursor-pointer"></span>\n                    </span>'),data:"all_wishlists",render:function render(e,t,a){function createWishlistHtml(e,t,a,i,n,s){e=e.filter(function(e){return e.list_number==n});var l=null,c;(s&&(l=wishlistNames&&wishlistNames[n]?wishlistNames[n]:headerWishlist+" "+n),e.length)&&(i+=getItemListHtml(e.slice().sort(function(e,t){return e.instance_order-t.instance_order||e.pivot.order-t.pivot.order}),"wishlist",a.id,!0,!0,"js-wishlist-sorted",!!guild.do_sort_items_by_instance,s?l:null),i+=getItemListHtml(e,"wishlist",a.id,!0,!1,"js-wishlist-unsorted",!guild.do_sort_items_by_instance,s?l:null));return i}if(e&&e.length){var n="";if(currentWishlistNumber)n=createWishlistHtml(e,t,a,n,currentWishlistNumber,!1);else for(i=1;i<=maxWishlistLists;i++)n=createWishlistHtml(e,t,a,n,i,!0);return""==n&&(n="—"),n}return"—"},orderable:!1,visible:!!showWishlist,width:"280px",className:"width-280"},{title:'<span class="text-success fas fa-fw fa-sack"></span> '.concat(headerReceived),data:"received",render:function render(e,t,a){return e&&e.length?getItemListHtml(e,"received",a.id):"—"},orderable:!1,visible:!0,width:"280px",className:"width-280"},{title:'<span class="text-gold fas fa-fw fa-book"></span> '.concat(headerRecipes),data:"recipes",render:function render(e,t,a){return e&&e.length?getItemListHtml(e,"recipes",a.id):"—"},orderable:!1,visible:!1,width:"280px",className:"width-280"},{title:"Roles",data:"user.roles",render:function render(e,t,a){var i="";return e&&e.length>0?(i='<ul class="list-inline">',e.forEach(function(e,t){var a=0!=e.color?"#"+rgbToHex(e.color):"#FFFFFF";i+='<li class="list-inline-item"><span class="tag" style="border-color:'.concat(a,';"><span class="role-circle" style="background-color:').concat(a,'"></span>').concat(e.name,"</span></li>")}),i+="</ul>"):i="—",i},orderable:!1,visible:!1},{title:'<span class="fas fa-fw fa-comment-alt-lines"></span> '.concat(headerNotes),data:"public_note",render:function render(e,t,a){return getNotes(e,t,a)},orderable:!1,visible:!0,width:"280px",className:"width-280"},{title:"Class",data:"class",render:function render(e,t,a){return a.class?a.class:null},visible:!1},{title:"Raid Group",data:"raid_group",render:function render(e,t,a){var i=""+(a.raid_group_id?a.raid_group_id:"");return a.secondary_raid_groups&&a.secondary_raid_groups.length&&a.secondary_raid_groups.forEach(function(e,t){i+="".concat(e.id," ")}),i},visible:!1},{title:"Username",data:"username",render:function render(e,t,a){return a.username?a.username:null},visible:!1},{title:"Discord Username",data:"discord_username",render:function render(e,t,a){return a.discord_username?a.discord_username:null},visible:!1},{title:"Raids Attended",data:"raid_count",render:function render(e,t,a){return a.raid_count?a.raid_count:null},visible:!1,searchable:!1}],order:[],paging:!1,fixedHeader:!0,drawCallback:function drawCallback(){makeWowheadLinks(),addClippedItemHandlers(),addItemAutocompleteHandler(),addTagInputHandlers(),addWishlistSortHandlers(),parseMarkdown(),trackTimestamps(),allItemsVisible?showAllItems():resetItemVisibility()},initComplete:function initComplete(){var e=[colClass,colRaidGroup];this.api().columns().every(function(t){var a=this,i=null,n=null;t==colClass?(i=$("#class_filter"),n=null):t==colRaidGroup&&(i=$("#raid_group_filter"),n=null),e.includes(t)&&(i.on("change",function(){var e=$.fn.dataTable.util.escapeRegex($(this).val());n&&n.val()&&(_readOnlyError("val"),e="(?=.*"+e+")(?=.*"+$.fn.dataTable.util.escapeRegex(n.val())+")"),a.search(e||"",!0,!1).draw()}).change(),n&&n.on("change",function(){var e=$.fn.dataTable.util.escapeRegex($(this).val());i&&i.val()&&(_readOnlyError("val"),e="(?=.*"+e+")(?=.*"+$.fn.dataTable.util.escapeRegex(i.val())+")"),a.search(e||"",!0,!1).draw()}).change()),"undefined"!=typeof filterWishlistsByItemName&&filterWishlistsByItemName&&t==colWishlist&&$("#wishlist_filter").on("change",function(){var e="("+itemNames.join("|")+")";a.search(e,!0,!1).draw()})}),makeWowheadLinks(),addItemAutocompleteHandler(),addTagInputHandlers(),addWishlistSortHandlers(),parseMarkdown()}}),rosterTable}function addClippedItemHandlers(){$(".js-show-clipped-items").click(function(){var e=$(this).data("id"),t=$(this).data("type");$(".js-clipped-item[data-id='"+e+"'][data-type='"+t+"']").show(),$(".js-show-clipped-items[data-id='"+e+"'][data-type='"+t+"']").hide(),$(".js-hide-clipped-items[data-id='"+e+"'][data-type='"+t+"']").show(),strikethroughVisible||hideStrikethroughItems(),offspecVisible||hideOffspecItems()}),$(".js-hide-clipped-items").click(function(){var e=$(this).data("id"),t=$(this).data("type");$(".js-clipped-item[data-id='"+e+"'][data-type='"+t+"']").hide(),$(".js-show-clipped-items[data-id='"+e+"'][data-type='"+t+"']").show(),$(".js-hide-clipped-items[data-id='"+e+"'][data-type='"+t+"']").hide()})}function addInstanceFilterHandlers(){$("#instance_filter").change(function(){var e=$("#instance_filter").val();if(e.length){allItemsVisible=!1,$(".js-show-all-clipped-items").click(),$(".js-show-all-clipped-items").hide(),$(".js-show-clipped-items").hide(),$(".js-hide-clipped-items").hide(),$("li.js-has-instance").hide();var t="";e.forEach(function(e){t+="li.js-has-instance[data-instance-id='"+e+"'],"}),t=t.replace(/(^,)|(,$)/g,""),$(t).show()}else $("li.js-has-instance").show(),allItemsVisible=!0,$(".js-show-all-clipped-items").click(),$(".js-show-all-clipped-items").show(),$(".js-show-clipped-items").show(),$(".js-hide-clipped-items").hide()})}function addWishlistFilterHandlers(){$("#wishlist_filter").on("change",function(){currentWishlistNumber=$(this).val(),rosterTable.rows().invalidate().draw()}).change()}function getItemListHtml(e,t,a){var i=arguments.length>3&&void 0!==arguments[3]&&arguments[3],n=arguments.length>4&&void 0!==arguments[4]&&arguments[4],s=arguments.length>5&&void 0!==arguments[5]?arguments[5]:null,l=!(arguments.length>6&&void 0!==arguments[6])||arguments[6],c=arguments.length>7&&void 0!==arguments[7]?arguments[7]:null,o='<ol class="no-indent js-item-list mb-2 '.concat(s,'" data-type="').concat(t,'" data-id="').concat(a,'" style="').concat(l?"":"display:none;",'">');c&&(o+='<li class="small text-muted no-bullet " data-type="'.concat(t,'" data-id="').concat(a,'">').concat(c,"</li>"));var r=4,d=null,p=null;return $.each(e,function(s,l){var c=!1;if(s>=4&&(c=!0,4==s&&(o+='<li class="js-show-clipped-items small cursor-pointer no-bullet " data-type="'.concat(t,'" data-id="').concat(a,'">show ').concat(e.length-4," more…</li>"))),"prio"==t&&l.pivot.raid_group_id&&l.pivot.raid_group_id!=p){p=l.pivot.raid_group_id;var r="";if(raidGroups.length){var u=raidGroups.find(function(e){return e.id===l.pivot.raid_group_id});u&&(r=u.name)}o+='\n                <li data-raid-group-id="" class="'.concat(c?"js-clipped-item":"",' js-item-wishlist-character no-bullet font-weight-normal font-italic text-muted small"\n                    style="').concat(c?"display:none;":"",'"\n                    data-type="').concat(t,'"\n                    data-id="').concat(a,'">\n                    ').concat(r,"\n                </li>\n            ")}n&&l.instance_id&&l.instance_id!=d&&(d=l.instance_id,o+='\n                <li class="js-has-instance '.concat(c?"js-clipped-item":"",' no-bullet font-weight-normal font-italic text-muted small"\n                    style="').concat(c?"display:none;":"",'"\n                    data-type="').concat(t,'"\n                    data-id="').concat(a,'"\n                    data-instance-id="').concat(l.instance_id,'">\n                    ').concat(l.instance_name,"\n                </li>\n            "));var h='data-wowhead-link="https://'.concat(wowheadLocale+wowheadSubdomain,".wowhead.com/item=").concat(l.item_id,'"\n            data-wowhead="item=').concat(l.item_id,"?domain=").concat(wowheadLocale+wowheadSubdomain,'"');o+='\n            <li class="js-has-instance font-weight-normal '.concat(c?"js-clipped-item":"",'"\n                data-type="').concat(t,'"\n                data-id="').concat(a,'"\n                data-offspec="').concat(l.pivot.is_offspec?1:0,'"\n                data-instance-id="').concat(l.instance_id,'"\n                data-wishlist-number="').concat(l.list_number,'"\n                value="').concat(i?l.pivot.order:"",'"\n                style="').concat(c?"display:none;":"",'">\n                ').concat(guild.tier_mode?'<span class="text-monospace font-weight-medium text-tier-'.concat(l.guild_tier?l.guild_tier:"",'">').concat(l.guild_tier?getItemTierLabel(l,guild.tier_mode):"&nbsp;","</span>"):"",'\n                <a href="/').concat(guild.id,"/").concat(guild.slug,"/i/").concat(l.item_id,"/").concat(slug(l.name),'"\n                    class="').concat(l.quality?"q"+l.quality:""," ").concat(!l.pivot.is_received||"wishlist"!=l.pivot.type&&"prio"!=l.pivot.type?"":"font-strikethrough",'"\n                    ').concat(h,">\n                    ").concat(l.name,"\n                </a>\n                ").concat(l.pivot.is_offspec?'<span title="offspec item" class="small font-weight-bold text-muted">OS</span>':"",'\n                <span class="js-watchable-timestamp js-timestamp-title smaller text-muted"\n                    data-timestamp="').concat(l.pivot.received_at?l.pivot.received_at:l.pivot.created_at,'"\n                    data-title="added by ').concat(l.added_by_username,' at"\n                    data-is-short="1">\n                </span>\n            </li>')}),e.length>4&&(o+='<li class="js-hide-clipped-items small cursor-pointer no-bullet" style="display:none;" data-type="'.concat(t,'" data-id="').concat(a,'">show less</li>')),o+="</ol>"}function getNotes(e,t,a){var i="";return a.secondary_raid_groups&&a.secondary_raid_groups.length&&(i='<ul class="list-inline">',a.secondary_raid_groups.forEach(function(e,t){i+='<li class="list-inline-item small"><span class="tag text-muted"><span class="role-circle align-fix" style="background-color:'.concat(getColorFromDec(parseInt(e.color)),'"></span>').concat(e.name,"</span></li>")}),i+="</ul>"),(a.public_note?'<span class="js-markdown-inline">'.concat(DOMPurify.sanitize(nl2br(a.public_note)),"</span>"):"—")+(a.officer_note?'<br><small class="font-weight-bold font-italic text-gold">Officer\'s Note</small><br><span class="js-markdown-inline">'.concat(DOMPurify.sanitize(nl2br(a.officer_note)),"</span>"):"")+(i?"<br>".concat(i):"")}function hideOffspecItems(){$("[data-offspec='1']").hide()}function showOffspecItems(){$("[data-offspec='1']:not(.js-clipped-item)").show()}function hideStrikethroughItems(){$("[data-type='prio']").children(".font-strikethrough").parent().hide(),$("[data-type='wishlist']").children(".font-strikethrough").parent().hide()}function showStrikethroughItems(){$("[data-type='prio']:not(.js-clipped-item)").children(".font-strikethrough").parent().show(),$("[data-type='wishlist']:not(.js-clipped-item)").children(".font-strikethrough").parent().show()}function resetItemVisibility(){$(".js-clipped-item").hide(),$(".js-show-clipped-items").show(),$(".js-hide-clipped-items").hide()}function showAllItems(){$(".js-clipped-item").show(),$(".js-show-clipped-items").hide(),$(".js-hide-clipped-items").hide()}$(document).ready(function(){var e=createTable();$(".toggle-column").click(function(t){t.preventDefault();var a=e.column($(this).attr("data-column"));a.visible(!a.visible())}),$(".toggle-column-default").click(function(t){t.preventDefault(),e.column(colName).visible(!0),e.column(colRoles).visible(!1),e.column(colLoot).visible(!0),e.column(colWishlist).visible(!0),e.column(colRecipes).visible(!1),e.column(colNotes).visible(!0)}),e.on("column-visibility.dt",function(e,t,a,i){makeWowheadLinks(),addClippedItemHandlers(),trackTimestamps(),parseMarkdown()}),$(".js-show-all-clipped-items").click(function(){allItemsVisible?(allItemsVisible=!1,resetItemVisibility()):(allItemsVisible=!0,showAllItems())}),$(".js-sort-by-raids-attended").click(function(){e.order(colRaidsAttended,"desc").draw()}),$(".js-hide-strikethrough-items").click(function(){strikethroughVisible?(strikethroughVisible=!1,hideStrikethroughItems()):(strikethroughVisible=!0,showStrikethroughItems())}),$(".js-hide-offspec-items").click(function(){offspecVisible?(offspecVisible=!1,hideOffspecItems()):(offspecVisible=!0,showOffspecItems())}),addClippedItemHandlers(),addInstanceFilterHandlers(),addWishlistFilterHandlers(),trackTimestamps(),$(".selectpicker").selectpicker("refresh")});
