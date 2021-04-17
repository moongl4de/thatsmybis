@extends('layouts.app')
@section('title', ($raid ? "Edit" : "Create") . " Raid - " . config('app.name'))

@php
    $maxDate = (new \DateTime())->modify('+2 year')->format('Y-m-d');

    // Iterating over 100+ characters 100+ items results in TENS OF THOUSANDS OF ITERATIONS.
    // So we're iterating over the characters only one time, saving the results, and printing them.
    $characterSelectOptions = (string)View::make('partials.characterOptions', ['characters' => $guild->characters]);

    $remarkSelectOptions = (string)View::make('partials.remarkOptions', ['characters' => $guild->characters]);
@endphp

@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-xl-10 offset-xl-1 col-12">
            <div class="row mb-3">
                @if ($raid)
                    <div class="col-12 pt-2 bg-lightest rounded">
                        {{ $raid->name }}
                    </div>
                @else
                    <div class="col-12 pt-2 mb-2">
                        <h1 class="font-weight-medium ">Create a Raid</h1>
                    </div>
                @endif
            </div>

            @if (count($errors) > 0)
                <ul class="alert alert-danger">
                    @foreach ($errors->all() as $error)
                        <li>
                            {{ $error }}
                        </li>
                    @endforeach
                </ul>
            @endif
            <form id="editForm" class="form-horizontal" role="form" method="POST" action="{{ route(($raid ? 'guild.raids.update' : 'guild.raids.create'), ['guildId' => $guild->id, 'guildSlug' => $guild->slug]) }}">
                {{ csrf_field() }}

                <input hidden name="id" value="{{ $raid ? $raid->id : '' }}" />

                <div class="row">
                    <div class="col-12 pt-2 pb-1 mb-3 bg-light rounded">
                        <div class="row">
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="date" class="font-weight-bold">
                                        <span class="text-muted fas fa-fw fa-calendar"></span>
                                        Date
                                    </label>
                                    <div>
                                        <input name="date"
                                            type="text"
                                            min="2004-09-22"
                                            max="{{ $maxDate }}"
                                            value="{{ old('date') ? old('date') : ($raid ? $raid->date : '') }}">
                                        <!-- <input name="date"
                                            required
                                            type="date"
                                            min="2004-09-22"
                                            max="{{ $maxDate }}"
                                            class="form-control dark"
                                            value="{{ old('date') ? old('date') : ($raid ? $raid->date : '') }}" /> -->
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-lg-6 col-12">
                                <div class="form-group">
                                    <label for="name" class="font-weight-bold">
                                        <span class="text-dk fas fa-fw fa-helmet-battle"></span>
                                        Raid Name
                                    </label>
                                    <input name="name"
                                        required
                                        maxlength="40"
                                        type="text"
                                        class="form-control dark"
                                        placeholder="eg. MC 42 Binding Run"
                                        value="{{ old('name') ? old('name') : ($raid ? $raid->name : '') }}" />
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-lg-6 col-12">
                                <div class="form-group">
                                    <label for="public_note" class="font-weight-bold">
                                        <span class="text-muted fas fa-fw fa-comment-alt-lines"></span>
                                        Public Note
                                        <small class="text-muted">anyone in the guild can see this</small>
                                    </label>
                                    <textarea maxlength="140" data-max-length="140" name="public_note" rows="2" placeholder="anyone in the guild can see this" class="form-control dark">{{ old('public_note') ? old('public_note') : ($raid ? $raid->public_note : '') }}</textarea>
                                </div>
                            </div>

                            @if ($currentMember->hasPermission('edit.officer-notes'))
                                <div class="col-lg-6 col-12">
                                    <div class="form-group">
                                        <label for="officer_note" class="font-weight-bold">
                                            <span class="text-muted fas fa-fw fa-shield"></span>
                                            Officer Note
                                            <small class="text-muted">only officers can see this</small>
                                        </label>
                                        @if (isStreamerMode())
                                        <div class="mt-1">
                                            Officer note is hidden in streamer mode
                                        </div>
                                        @else
                                            <textarea maxlength="140" data-max-length="140" name="officer_note" rows="2" placeholder="only officers can see this" class="form-control dark">{{ old('officer_note') ? old('officer_note') : ($raid ? $raid->officer_note : '') }}</textarea>
                                        @endif
                                    </div>
                                </div>
                            @endif
                        </div>
                        <div class="row">
                            <div class="col-lg-6 col-12">
                                <div class="form-group">
                                    <label for="logs" class="font-weight-bold">
                                        <span class="text-muted fas fa-fw fa-link"></span>
                                        Link to Raid Logs
                                    </label>
                                    <input name="logs"
                                        maxlength="255"
                                        type="text"
                                        class="form-control dark"
                                        placeholder="a warcraftlogs.com link perhaps?"
                                        value="{{ old('logs') ? old('logs') : ($raid ? $raid->logs : '') }}" />
                                </div>
                            </div>

                            @if ($raid)
                                <div class="col-sm-6 col-12">
                                    <div class="form-group mb-0">
                                        <div class="checkbox">
                                            <label>
                                                <input type="checkbox" name="is_cancelled" value="1" class="" autocomplete="off"
                                                    {{ old('is_cancelled') && old('is_cancelled') == 1 ? 'checked' : ($raid && $raid->is_cancelled ? 'checked' : '') }}>
                                                    Cancelled <small class="text-muted">closest you can get to deleting this</small>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            @endif
                        </div>
                    </div>
                </div>

                <div class="row mb-3 pb-1 pt-2 bg-light rounded">
                    <div class="col-sm-6 col-12">
                        <label for="instance_id[0]" class="font-weight-bold">
                            <span class="fas fa-fw fa-dungeon text-muted"></span>
                            Dungeon(s)
                        </label>
                        @for ($i = 0; $i < $maxInstances; $i++)
                            <div class="form-group {{ $i > 0 ? 'js-hide-empty' : '' }}" style="{{ $i > 0 ? 'display:none;' : '' }}">
                                <select name="instance_id[]" class="form-control dark {{ $i >= 0 ? 'js-show-next' : '' }}">
                                    <option value="" selected>
                                        —
                                    </option>

                                    @foreach ($instances as $instance)
                                        <option value="{{ $instance->id }}"
                                            {{ old('instance_id.' . $i) && old('instance_id.' . $i) == $instance->id ? 'selected' : ($raid && $raid->instances->slice($i, 1) && $raid->instances->slice($i, 1) == $instance->id ? 'selected' : '') }}>
                                            {{ $instance->name }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                        @endfor
                    </div>

                    <div class="col-sm-6 col-12">
                        <label for="raid_group_id[0]" class="font-weight-bold">
                            <span class="fas fa-fw fa-users text-muted"></span>
                            Raid Group(s)
                        </label>
                        @for ($i = 0; $i < $maxRaids; $i++)
                            <div class="form-group {{ $i > 0 ? 'js-hide-empty' : '' }}" style="{{ $i > 0 ? 'display:none;' : '' }}">
                                <select name="raid_group_id[]" class="form-control dark {{ $i >= 0 ? 'js-show-next' : '' }}">
                                    <option value="" selected>
                                        —
                                    </option>

                                    @foreach ($guild->raidGroups as $raidGroup)
                                        <option value="{{ $raidGroup->id }}"
                                            style="color:{{ $raidGroup->getColor() }};"
                                            {{ old('raid_group_id.' . $i) && old('raid_group_id.' . $i) == $raidGroup->id ? 'selected' : ($raid && $raid->raidGroups->slice($i, 1) && $raid->raidGroups->slice($i, 1) == $raidGroup->id ? 'selected' : '') }}>
                                            {{ $raidGroup->name }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                        @endfor
                    </div>
                </div>

                <div class="row">
                    <div class="col-12 mt-3 mb-3 bg-light rounded">
                        @for ($i = 0; $i < $maxCharacters; $i++)
                            @php
                                $characterId = 'characters.' . $i . '.id';
                                $character = $raid && $raid->characters->slice($i, 1) ? $raid->characters->slice($i, 1) : null;

                                $hide = false;

                                if ($i > 2) {
                                    if (old($characterId) && old($characterId) == null) {
                                        $hide = true;
                                    } else if (!old($characterId) && !$character) {
                                        $hide = true;
                                    }
                                }
                            @endphp

                            <div class="js-row row striped-light pb-4 pt-4 rounded {{ $i > 2 ? 'js-hide-empty' : '' }}" style="{{ $hide ? 'display:none;' : '' }}">

                                <!-- Exempt -->
                                <div class="col-lg-1 col-2">
                                    <div class="form-group text-center">
                                        <label for="character[{{ $i }}][exempt]" class="font-weight-bold">
                                            @if ($i == 0)
                                                <span class="fas fa-fw fa-undo text-muted"></span>
                                                Skip
                                            @else
                                                <span class="fas fa-fw fa-undo text-muted"></span>
                                                <span class="sr-only">
                                                    Skip Character
                                                </span>
                                            @endif
                                        </label>
                                        <div class="checkbox">
                                            <label title="item is offspec">
                                                <input data-index="{{ $i }}" class="js-attendance-skip" type="checkbox" name="character[{{ $i }}][exempt]" value="1" autocomplete="off"
                                                    {{ old('characters.' . $i . '.exempt') && old('characters.' . $i . '.exempt') == 1  ? 'checked' : '' }}>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-lg-11 col-10">
                                    <div class="row">
                                        <!-- Character dropdown -->
                                        <div class="col-xl-5 col-lg-5 col-12">
                                            <div class="form-group mb-0 {{ $errors->has('characters.' . $i . '.character_id') ? 'text-danger font-weight-bold' : '' }}">

                                                <label for="character_id" class="font-weight-bold">
                                                    @if ($i == 0)
                                                        <span class="fas fa-fw fa-user text-muted"></span>
                                                        Character
                                                    @else
                                                        <span class="fas fa-fw fa-user text-muted"></span>
                                                        <span class="sr-only">
                                                            Character
                                                        </span>
                                                    @endif
                                                </label>

                                                <select name="character[{{ $i }}][character_id]" class="js-show-next-character form-control dark {{ $errors->has('characters.' . $i . '.character_id') ? 'form-danger' : '' }}" data-live-search="true" autocomplete="off">
                                                    <option value="">
                                                        —
                                                    </option>

                                                    {{-- See the notes at the top for why the options look like this --}}
                                                    @if (old('characters.' . $i . '.character_id'))
                                                        @php
                                                            // Select the correct option
                                                            $options = str_replace('hack="' . old('characters.' . $i . '.character_id') . '"', 'selected', $characterSelectOptions);
                                                         @endphp
                                                         {!! $options !!}
                                                    @else
                                                        {!! $characterSelectOptions !!}
                                                    @endif
                                                </select>

                                                @if ($errors->has('characters.' . $i))
                                                    <div class="'text-danger font-weight-bold'">
                                                        {{ $errors->first('characters.' . $i) }}
                                                    </div>
                                                @endif
                                            </div>
                                        </div>

                                        <!-- Remarks dropdown -->
                                        <div class="col-lg-4 col-sm-6 col-12">
                                            <div class="form-group mb-0 {{ $errors->has('characters.' . $i . '.remark') ? 'text-danger font-weight-bold' : '' }}">

                                                <label for="remark" class="font-weight-bold">
                                                    @if ($i == 0)
                                                        <span class="fas fa-fw fa-quote-left text-muted"></span>
                                                        Note
                                                    @else
                                                        <span class="fas fa-fw fa-quote-left text-muted"></span>
                                                        <span class="sr-only">
                                                            Note
                                                        </span>
                                                    @endif
                                                </label>

                                                <select name="character[{{ $i }}][remark]" class="form-control dark {{ $errors->has('characters.' . $i . '.remark') ? 'form-danger' : '' }}" data-live-search="true" autocomplete="off">
                                                    <option value="">
                                                        —
                                                    </option>

                                                    {{-- See the notes at the top for why the options look like this --}}
                                                    @if (old('characters.' . $i . '.remark'))
                                                        @php
                                                            // Select the correct option
                                                            $options = str_replace('hack="' . old('characters.' . $i . '.remark') . '"', 'selected', $remarkSelectOptions);
                                                         @endphp
                                                         {!! $options !!}
                                                    @else
                                                        {!! $remarkSelectOptions !!}
                                                    @endif
                                                </select>

                                                @if ($errors->has('characters.' . $i))
                                                    <div class="'text-danger font-weight-bold'">
                                                        {{ $errors->first('characters.' . $i) }}
                                                    </div>
                                                @endif
                                            </div>
                                        </div>

                                        <!-- Credit slider -->
                                        <div class="col-lg-3 col-sm-6 col-12">
                                            <div class="form-group text-center  mb-0 {{ $errors->has('characters.' . $i . '.credit') ? 'text-danger font-weight-bold' : '' }}">

                                                <label for="credit" class="font-weight-bold">
                                                    @if ($i == 0)
                                                        <span class="fas fa-fw fa-user-chart text-muted"></span>
                                                        Attendance Credit
                                                    @else
                                                        <span class="fas fa-fw fa-user-chart text-muted"></span>
                                                        <span class="sr-only">
                                                            Attendance Credit
                                                        </span>
                                                    @endif
                                                </label>

                                                <div data-attendance-input="{{ $i }}" class="small text-muted {{ $errors->has('characters.' . $i . '.credit') ? 'form-danger' : '' }}">
                                                    <input type="text"
                                                        name="character[{{ $i }}][credit]"
                                                        autocomplete="off"
                                                        data-provide="slider"
                                                        data-slider-ticks="[0.0, 0.25, 0.5, 0.75, 1.0]"
                                                        data-slider-ticks-labels='["0%", "25%", "50%", "75%", "100%"]'
                                                        data-slider-min="0"
                                                        data-slider-max="1"
                                                        data-slider-step="0.25"
                                                        data-slider-value="{{ old('characters.' . $i . '.credit') ? old('characters.' . $i . '.credit') : ($character ? $character->credit : 1) }}"
                                                        data-slider-tooltip="hide" />
                                                </div>
                                                <div data-attendance-skip-note="{{ $i }}" class="text-warning" style="display:none;">
                                                    Attendance will be skipped - this won't count against their overall attendance
                                                </div>

                                                @if ($errors->has('characters.' . $i))
                                                    <div class="'text-danger font-weight-bold'">
                                                        {{ $errors->first('characters.' . $i) }}
                                                    </div>
                                                @endif
                                            </div>
                                        </div>

                                        <div class="col-12 text-right">
                                            <span class="js-show-notes text-link cursor-pointer">add note</span>
                                        </div>

                                        <div class="js-notes col-12" style="display:none;">
                                            <div class="row">
                                                <!-- Note -->
                                                <div class="js-note col-lg-6 col-12">
                                                    <div class="form-group mb-0 {{ $errors->has('characters.' . $i . '.note') ? 'text-danger font-weight-bold' : '' }}">

                                                        <label for="character[{{ $i }}][note]" class="font-weight-bold">
                                                            @if ($i == 0)
                                                                <span class="fas fa-fw fa-comment-alt-lines text-muted"></span>
                                                                Custom Note
                                                            @else
                                                                &nbsp;
                                                                <span class="sr-only">
                                                                    Custom Note
                                                                </span>
                                                            @endif
                                                        </label>
                                                        <input name="character[{{ $i }}][note]" maxlength="140" data-max-length="140" type="text" placeholder="brief public note"
                                                            class="form-control dark {{ $errors->has('characters.' . $i . '.note') ? 'form-danger' : '' }}" autocomplete="off"
                                                            value="{{ old('characters.' . $i . '.note') ? old('characters.' . $i . '.note') : '' }}">
                                                    </div>
                                                </div>

                                                <!-- Officer Note -->
                                                <div class="js-note col-lg-6 col-12">
                                                    <div class="form-group mb-0 {{ $errors->has('characters.' . $i . '.officer_note') ? 'text-danger font-weight-bold' : '' }}">

                                                        <label for="character[{{ $i }}][officer_note]" class="font-weight-bold">
                                                            @if ($i == 0)
                                                                <span class="fas fa-fw fa-shield text-muted"></span>
                                                                Officer Note
                                                            @else
                                                                &nbsp;
                                                                <span class="sr-only">
                                                                    Optional Officer Note
                                                                </span>
                                                            @endif
                                                        </label>
                                                        @if (isStreamerMode())
                                                            <div class="mt-2">
                                                                Officer note is hidden in streamer mode
                                                            </div>
                                                        @endif
                                                        <input name="character[{{ $i }}][officer_note]" maxlength="140" data-max-length="140" type="text" placeholder="officer note"
                                                            class="form-control dark {{ $errors->has('characters.' . $i . '.officer_note') ? 'form-danger' : '' }}" autocomplete="off"
                                                            style="{{ isStreamerMode() ? 'display:none;' : '' }}"
                                                            value="{{ old('characters.' . $i . '.officer_note') ? old('characters.' . $i . '.officer_note') : '' }}">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        @if ($i == $maxCharacters - 1)
                                            <div class="col-12 mt-3 text-danger font-weight-bold">
                                                Max characters added
                                            </div>
                                        @endif
                                    </div>
                                </div>
                            </div>
                        @endfor
                    </div>
                </div>

                <div class="form-group">
                    <button class="btn btn-success"><span class="fas fa-fw fa-save"></span> Save</button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script>
    var characters = {!! $showOfficerNote ? $guild->characters->makeVisible('officer_note')->toJson() : $guild->characters->toJson() !!};

    $(document).ready(function () {
        warnBeforeLeaving("#editForm")

        $("[name=date]").datetimepicker({
            format: 'Y.m.d H:i',
            inline: true,
            step: 30,
            theme: 'dark',
        });

        $("[name=raid_group_id\\[\\]]").change(function () {
            fillCharactersFromRaid($(this).val());
        });

        $(".js-show-next").change(function() {
            showNext(this);
        }).change();

        $(".js-show-next").keyup(function() {
            showNext(this);
        });

        $(".js-show-next-character").change(function() {
            showNextCharacter(this);
        }).change();

        $(".js-show-next-character").keyup(function() {
            showNextCharacter(this);
        });

        $(".js-show-notes").click(function () {
            $(this).hide();
            $(this).parent().next(".js-notes").show();
        });

        $(".js-attendance-skip").on('change', function () {
            const index = $(this).data('index');
            if (this.checked) {
                $(`[data-attendance-input="${index}"]`).addClass("disabled").hide();
                $(`[data-attendance-skip-note="${index}"]`).show();
            } else {
                $(`[data-attendance-input="${index}"]`).removeClass("disabled").show();
                $(`[data-attendance-skip-note="${index}"]`).hide();
            }
        }).change();
    });

    function fillCharactersFromRaid(raidGroupId) {
        const raidGroupCharacters = characters.find(character => character.raid_group_id == raidGroupId);

        // Find first empty character input, select appropriate character
    }

    // Hack to get the slider's labels to refresh: https://github.com/seiyria/bootstrap-slider/issues/396#issuecomment-310415503
    function fixSliderLabels() {
        window.dispatchEvent(new Event('resize'));
    }

    // If the current element has a value, show it and the next element that is hidden because it is empty
    function showNext(currentElement) {
        if ($(currentElement).val() != "") {
            $(currentElement).show();
            $(currentElement).parent().next(".js-hide-empty").show();
        }
    }

    // If the current element has a value, show it and the next element that is hidden because it is empty
    function showNextCharacter(currentElement) {
        if ($(currentElement).val() != "") {
            $(currentElement).show();
            let nextElement = $(currentElement).closest(".js-row").next(".js-hide-empty");
            nextElement.show();
            nextElement.find("select[name^=character][name$=\\[character_id\\]]").addClass("selectpicker").selectpicker();
            fixSliderLabels();
        }
    }
</script>
@endsection
