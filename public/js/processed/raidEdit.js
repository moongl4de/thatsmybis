function findExistingCharacter(e){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;return a?$('select[name^=characters][name$=\\[character_id\\]] option:selected[value="'.concat(e,'"]')).not(a).first():$('select[name^=characters][name$=\\[character_id\\]] option:selected[value="'.concat(e,'"]')).first()}function fillCharactersFromRaid(e){var a=characters.filter(function(a){return a.raid_group_id==e}),t=0,n=0,c=!0,i=!1,r=void 0;try{for(var s=a[Symbol.iterator](),o;!(c=(o=s.next()).done);c=!0){var d=o.value,h;if(findExistingCharacter(d.id).length)n++;else{var l=$('select[name^=characters][name$=\\[character_id\\]] option:selected[value=""]').first().parent(),m=l.find('option[value="'+d.id+'"i]');m.val()&&(m.prop("selected",!0).change(),t++);var u=l.parent().closest(".js-row");$(u).find("[name^=characters][name$=\\[is_exempt\\]]").prop("checked",!1).change(),$(u).find("[name^=characters][name$=\\[remark_id\\]]").val("").change(),$(u).find("[name^=characters][name$=\\[credit\\]]").bootstrapSlider("setValue",1)}}}catch(e){i=!0,r=e}finally{try{c||null==s.return||s.return()}finally{if(i)throw r}}$(".js-raid-group-message").html("".concat(t," characters added").concat(n?" (".concat(n," already in list)"):"")).show(),setTimeout(function(){return $(".js-raid-group-message").hide()},7500)}function fixSliderLabels(){window.dispatchEvent(new Event("resize"))}function showNext(e){""!=$(e).val()&&($(e).show(),$(e).parent().next(".js-hide-empty").show())}function showNextCharacter(e){if(""!=$(e).val()){$(e).show();var a=$(e).closest(".js-row").next(".js-hide-empty");a.show(),a.find("select[name^=characters][name$=\\[character_id\\]]").addClass("selectpicker").selectpicker(),fixSliderLabels()}}function updateDate(){$("[name=date_input]").val()?$("[name=date]").val(moment($("[name=date_input]").val()).utc().format("YYYY-MM-DD HH:mm:ss")):($("[name=date]").val(date),$("[name=date_input]").val(moment.utc(date).local().format("YYYY-MM-DD HH:mm:ss")))}$(document).ready(function(){var e=!0;warnBeforeLeaving("#editForm"),$("[name=date_input]").datetimepicker({format:"Y-m-d H:i:s",inline:!0,step:30,theme:"dark",value:moment.utc(date).local().format("YYYY-MM-DD HH:mm:ss")}),$("[name=date_input]").change(function(){updateDate()}),updateDate(),$("[name=raid_group_id\\[\\]]").change(function(){e||$(this).val()&&fillCharactersFromRaid($(this).val())}),$("[name^=characters][name$=\\[character_id\\]").change(function(){var a;e||findExistingCharacter($(this).val(),$(this).find(":selected")).length&&$(this).selectpicker("val","").selectpicker("refresh")}),$(".js-show-next").change(function(){showNext(this)}).change(),$(".js-show-next").keyup(function(){showNext(this)}),$(".js-show-next-character").change(function(){showNextCharacter(this)}).change(),$(".js-show-next-character").keyup(function(){showNextCharacter(this)}),$(".js-show-notes").click(function(){var e=$(this).data("index");$(this).hide(),$('.js-notes[data-index="'.concat(e,'"]')).show()}),$(".js-attendance-skip").on("change",function(){var e=$(this).data("index");this.checked?($('[data-attendance-input="'.concat(e,'"]')).addClass("disabled").hide(),$('[data-attendance-skip-note="'.concat(e,'"]')).show()):($('[data-attendance-input="'.concat(e,'"]')).removeClass("disabled").show(),$('[data-attendance-skip-note="'.concat(e,'"]')).hide())}).change(),e=!1});
