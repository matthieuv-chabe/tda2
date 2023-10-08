import * as MapsTypes from "./maps.types";

export type Vec2d = [number, number];

export type GglPathInfoAtTime_t = {
    roadname: string;
    polylinepos: string; // To be parsed by GeoHelpers.decode_polyline()
    expected_remaining_time?: number;
    percent_of_current_path?: number;
    ETA_in_seconds?: number;
}

export class GglPathResponse {

    // Data
    data: MapsTypes.GoogleResponse;
    is_ok: boolean;

    // Time information
    mTimeInfo: {time_end: number, data: GglPathInfoAtTime_t}[] = [];

    constructor(
        json: any,
        options = {
            compute_timeinfo_at_init: true,
        },
    ) {

        try {
            this.data = json;
            this.is_ok = true;
        } catch (e: any) {
            this.is_ok = false;
            throw new Error(`GglPathResponse: ${e.message}`);
        }

        if(options.compute_timeinfo_at_init)
            this._build_time_info();
    }

    /**
     * Builds time information for the current route.
     * @private
     * @returns {void}
     */
    private _build_time_info(): void {

        const full_time = this.data.routes[0].legs[0].duration.value;

        let time = 0;
        for (const step of this.data.routes[0].legs[0].steps) {
            const duration = step.duration.value;
            time += duration;
            this.mTimeInfo.push({
                time_end: time,
                data: {
                    roadname: "",
                    polylinepos: step.polyline.points,
                    expected_remaining_time: full_time - time,
                    percent_of_current_path: 0, // To be defined when a time is provided
                },
            });
        }
    }

    public get status(): string {
        return this.data.status;
    }

    private _info_at_time_compute_percent_of_current_path(current_step_index: number, time: number): number {
        const time_of_this_step = time - this.mTimeInfo[current_step_index - 1].time_end;
        const time_of_next_step = this.mTimeInfo[current_step_index].time_end - this.mTimeInfo[current_step_index - 1].time_end;
        const percent_of_this_step = time_of_this_step / time_of_next_step;

        return percent_of_this_step * 100;
    }

    private _info_at_time_compute_ETA_full(current_step_index: number, time: number): number {
        const total_time_in_seconds = this.data.routes[0].legs[0].duration.value;

        return total_time_in_seconds - time;
    }

    public info_at_time(time: number): GglPathInfoAtTime_t | undefined {

        if(!this.mTimeInfo.length)
        {
            console.warn(`GglPathResponse: No time information available. Did you set the option compute_timeinfo_at_init to true?`);
            console.log("Calculating time information now. You should set the option compute_timeinfo_at_init to true to save time.");
            this._build_time_info();
        }

        const current_step_index = this.mTimeInfo.findIndex((t) => t.time_end >= time);

        const info = this.mTimeInfo[current_step_index].data;

        try {
            info.percent_of_current_path = this._info_at_time_compute_percent_of_current_path(current_step_index, time);
        } catch (e: any) { console.warn(`GglPathResponse: ${e.message}`); }

        try {
            info.ETA_in_seconds = this._info_at_time_compute_ETA_full(current_step_index, time);
        } catch (e: any) { console.warn(`GglPathResponse: ${e.message}`); }

        return info;
    }

}

