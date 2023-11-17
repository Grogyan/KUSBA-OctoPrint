/*
 * View model for Octoprint Accelerometer
 *
 * Author: Raoul Rubien
 * License: Apache-2.0
 */
$(function() {
    function AccelerometerViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];
        self.access = parameters[1];
        self.settings = parameters[2];

        self.plugin_name = "octoprint_accelerometer";

        // variables shared among plugin and settings
        self.ui_estimated_recording_duration_s = ko.observable();
        self.ui_do_sample_x = ko.observable();
        self.ui_do_sample_y = ko.observable();
        self.ui_do_sample_z = ko.observable();
        self.ui_repetitions_count = ko.observable();
        self.ui_distance_x_mm = ko.observable();
        self.ui_distance_y_mm = ko.observable();
        self.ui_distance_z_mm = ko.observable();
        self.ui_speed_x_mm_s = ko.observable();
        self.ui_speed_y_mm_s = ko.observable();
        self.ui_speed_z_mm_s = ko.observable();
        self.ui_acceleration_x_mm_ss = ko.observable();
        self.ui_acceleration_y_mm_ss = ko.observable();
        self.ui_acceleration_z_mm_ss = ko.observable();
        self.ui_frequency_start = ko.observable();
        self.ui_frequency_stop = ko.observable();
        self.ui_frequency_step = ko.observable();
        self.ui_zeta_start = ko.observable();
        self.ui_zeta_stop = ko.observable();
        self.ui_zeta_step = ko.observable();
        self.ui_recording_timespan_s = ko.observable();
        self.ui_repetitions_separation_s = ko.observable();
        self.ui_steps_separation_s = ko.observable();

        self.onStartupComplete = function () {
            self.plugin_settings = self.settings.settings.plugins.octoprint_accelerometer;

            var updatePluginDataAndRequestEstimation = function () {
                self.updatePluginDataFromUi();
                self.requestPluginEstimation();
            };

            // register on settings changes
            var settings_observables = [
                [self.plugin_settings.do_sample_x, self.ui_do_sample_x],
                [self.plugin_settings.do_sample_y, self.ui_do_sample_y],
                [self.plugin_settings.do_sample_z, self.ui_do_sample_z],
                [self.plugin_settings.repetitions_count, self.ui_repetitions_count],
                [self.plugin_settings.distance_x_mm, self.ui_distance_x_mm],
                [self.plugin_settings.distance_y_mm, self.ui_distance_y_mm],
                [self.plugin_settings.distance_z_mm, self.ui_distance_z_mm],
                [self.plugin_settings.speed_x_mm_s, self.ui_speed_x_mm_s],
                [self.plugin_settings.speed_y_mm_s, self.ui_speed_y_mm_s],
                [self.plugin_settings.speed_z_mm_s, self.ui_speed_z_mm_s],
                [self.plugin_settings.acceleration_x_mm_ss, self.ui_acceleration_x_mm_ss],
                [self.plugin_settings.acceleration_y_mm_ss, self.ui_acceleration_y_mm_ss],
                [self.plugin_settings.acceleration_z_mm_ss, self.ui_acceleration_z_mm_ss],
                [self.plugin_settings.frequency_start, self.ui_frequency_start],
                [self.plugin_settings.frequency_stop, self.ui_frequency_stop],
                [self.plugin_settings.frequency_step, self.ui_frequency_step],
                [self.plugin_settings.zeta_start, self.ui_zeta_start],
                [self.plugin_settings.zeta_stop, self.ui_zeta_stop],
                [self.plugin_settings.zeta_step, self.ui_zeta_step],
                [self.plugin_settings.recording_timespan_s, self.ui_recording_timespan_s],
                [self.plugin_settings.repetitions_separation_s, self.ui_repetitions_separation_s],
                [self.plugin_settings.steps_separation_s, self.ui_steps_separation_s],
            ];

            for (let index = 0; index < settings_observables.length; ++index) {
                settings_observables[index][0].subscribe(
                    function (newValue){
                        settings_observables[index][1](newValue);
                        updatePluginDataAndRequestEstimation();
                });
            }

            // send UI data to plugin and fetch updates from plugin
            var observables = [
                [self.ui_do_sample_x, updatePluginDataAndRequestEstimation],
                [self.ui_do_sample_y, updatePluginDataAndRequestEstimation],
                [self.ui_do_sample_z, updatePluginDataAndRequestEstimation],
                [self.ui_repetitions_count, updatePluginDataAndRequestEstimation],
                [self.ui_distance_x_mm, updatePluginDataAndRequestEstimation],
                [self.ui_distance_y_mm, updatePluginDataAndRequestEstimation],
                [self.ui_distance_z_mm, updatePluginDataAndRequestEstimation],
                [self.ui_speed_x_mm_s, updatePluginDataAndRequestEstimation],
                [self.ui_speed_y_mm_s, updatePluginDataAndRequestEstimation],
                [self.ui_speed_z_mm_s, updatePluginDataAndRequestEstimation],
                [self.ui_acceleration_x_mm_ss, updatePluginDataAndRequestEstimation],
                [self.ui_acceleration_y_mm_ss, updatePluginDataAndRequestEstimation],
                [self.ui_acceleration_z_mm_ss, updatePluginDataAndRequestEstimation],
                [self.ui_frequency_start, updatePluginDataAndRequestEstimation],
                [self.ui_frequency_stop, updatePluginDataAndRequestEstimation],
                [self.ui_frequency_step, updatePluginDataAndRequestEstimation],
                [self.ui_zeta_start, updatePluginDataAndRequestEstimation],
                [self.ui_zeta_stop, updatePluginDataAndRequestEstimation],
                [self.ui_zeta_step, updatePluginDataAndRequestEstimation],
                [self.ui_recording_timespan_s, updatePluginDataAndRequestEstimation],
                [self.ui_repetitions_separation_s, updatePluginDataAndRequestEstimation],
                [self.ui_steps_separation_s, updatePluginDataAndRequestEstimation],
            ];

            for (let index = 0; index < observables.length; ++index) {
                observables[index][0].subscribe(observables[index][1]);
            }

            self.getPluginData();
        };

        // plugin API

        self.getPluginData = function () {
            if (!self.loginState.hasPermission(self.access.permissions.CONNECTION)) { return; }
            self.requestPluginEstimation();
            self.requestAllParameters();

        }

        self.updatePluginDataFromUi = function () {
            self.requestCommandPost("set_values",
                {"do_sample_x": self.ui_do_sample_x(),
                 "do_sample_y": self.ui_do_sample_y(),
                 "do_sample_z": self.ui_do_sample_z(),
                 "repetitions_count": self.ui_repetitions_count(),
                 "distance_x_mm": self.ui_distance_x_mm(),
                 "distance_y_mm": self.ui_distance_y_mm(),
                 "distance_z_mm": self.ui_distance_z_mm(),
                 "speed_x_mm_s": self.ui_speed_x_mm_s(),
                 "speed_y_mm_s": self.ui_speed_y_mm_s(),
                 "speed_z_mm_s": self.ui_speed_z_mm_s(),
                 "acceleration_x_mm_ss": self.ui_acceleration_x_mm_ss(),
                 "acceleration_y_mm_ss": self.ui_acceleration_y_mm_ss(),
                 "acceleration_z_mm_ss": self.ui_acceleration_z_mm_ss(),
                 "frequency_start": self.ui_frequency_start(),
                 "frequency_stop": self.ui_frequency_stop(),
                 "frequency_step": self.ui_frequency_step(),
                 "zeta_start": self.ui_zeta_start(),
                 "zeta_stop": self.ui_zeta_stop(),
                 "zeta_step": self.ui_zeta_step(),
                 "recording_timespan_s": self.ui_recording_timespan_s(),
                 "repetitions_separation_s": self.ui_repetitions_separation_s(),
                 "steps_separation_s": self.ui_steps_separation_s(),
                 });
        };

        self.requestPluginEstimation = function () { self.requestGet("estimate"); };
        self.requestAllParameters = function () { self.requestGet("parameters"); };

        // ----- GET/POST plugin API

        self.requestCommandPost = function (command, payload) {
            OctoPrint.simpleApiCommand(self.plugin_name, command, payload);
        };

        self.updateUiFromGetResponse = function (response) {

            if (Object.hasOwn(response, "estimate")) {
                self.ui_estimated_recording_duration_s(response.estimate);
            }

            if (Object.hasOwn(response, "parameters")) {
                var do_sample_x = response.parameters.do_sample_x;
                var do_sample_y = response.parameters.do_sample_y;
                var do_sample_z = response.parameters.do_sample_z;
                var repetitions_count = response.parameters.repetitions_count;
                var distance_x_mm = response.parameters.distance_x_mm;
                var distance_y_mm = response.parameters.distance_y_mm;
                var distance_z_mm = response.parameters.distance_z_mm;
                var speed_x_mm_s = response.parameters.speed_x_mm_s;
                var speed_y_mm_s = response.parameters.speed_y_mm_s;
                var speed_z_mm_s = response.parameters.speed_z_mm_s;
                var acceleration_x_mm_ss = response.parameters.acceleration_x_mm_ss;
                var acceleration_y_mm_ss = response.parameters.acceleration_y_mm_ss;
                var acceleration_z_mm_ss = response.parameters.acceleration_z_mm_ss;
                var frequency_start = response.parameters.frequency_start;
                var frequency_stop = response.parameters.frequency_stop;
                var frequency_step = response.parameters.frequency_step;
                var zeta_start = response.parameters.zeta_start;
                var zeta_stop = response.parameters.zeta_stop;
                var zeta_step = response.parameters.zeta_step;
                var recording_timespan_s = response.parameters.recording_timespan_s;
                var repetitions_separation_s = response.parameters.repetitions_separation_s;
                var steps_separation_s = response.parameters.steps_separation_s;

                if (do_sample_x) { self.ui_do_sample_x(do_sample_x); }
                if (do_sample_y) { self.ui_do_sample_y(do_sample_y); }
                if (do_sample_z) { self.ui_do_sample_z(do_sample_z); }
                if (repetitions_count) { self.ui_repetitions_count(repetitions_count); }
                if (distance_x_mm) { self.ui_distance_x_mm(distance_x_mm); }
                if (distance_y_mm) { self.ui_distance_y_mm(distance_y_mm); }
                if (distance_z_mm) { self.ui_distance_z_mm(distance_z_mm); }
                if (speed_x_mm_s) { self.ui_speed_x_mm_s(speed_x_mm_s); }
                if (speed_y_mm_s) { self.ui_speed_y_mm_s(speed_y_mm_s); }
                if (speed_z_mm_s) { self.ui_speed_z_mm_s(speed_z_mm_s); }
                if (acceleration_x_mm_ss) { self.ui_acceleration_x_mm_ss(acceleration_x_mm_ss); }
                if (acceleration_y_mm_ss) { self.ui_acceleration_y_mm_ss(acceleration_y_mm_ss); }
                if (acceleration_z_mm_ss) { self.ui_acceleration_z_mm_ss(acceleration_z_mm_ss); }
                if (frequency_start) { self.ui_frequency_start(frequency_start); }
                if (frequency_stop) { self.ui_frequency_stop(frequency_stop); }
                if (frequency_step) { self.ui_frequency_step(frequency_step); }
                if (zeta_start) { self.ui_zeta_start(zeta_start); }
                if (zeta_stop) { self.ui_zeta_stop(zeta_stop); }
                if (zeta_step) { self.ui_zeta_step(zeta_step); }
                if (recording_timespan_s) { self.ui_recording_timespan_s(recording_timespan_s); }
                if (repetitions_separation_s) { self.ui_repetitions_separation_s(repetitions_separation_s); }
                if (steps_separation_s) { self.ui_steps_separation_s(steps_separation_s); }
            }
        };

        self.requestGet = function (request) {
            OctoPrint.simpleApiGet(self.plugin_name +"?q="+ request).done(self.updateUiFromGetResponse);
        };
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: AccelerometerViewModel,
        name: "accelerometerViewModel",
        dependencies: ["loginStateViewModel",
                       "accessViewModel",
                       "settingsViewModel"],
        elements: [ "#tab_plugin_octoprint_accelerometer"]
    });
});
