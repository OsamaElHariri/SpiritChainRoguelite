import { Interval } from "./interval";

type ZoomConfig = { zoom: number, duration: number, ease?: string | Function, force?: boolean, predelay?: number, postdelay?: number };

export class CameraUtils {


    static async chainZoom(camera: Phaser.Cameras.Scene2D.Camera, effects: ZoomConfig[]) {
        for (let i = 0; i < effects.length; i++) {
            const config = effects[i];
            if (config.predelay) await Interval.milliseconds(config.predelay);
            await this.zoomCamera(camera, config);
            if (config.postdelay) await Interval.milliseconds(config.postdelay);
        }
    }

    private static zoomCamera(camera: Phaser.Cameras.Scene2D.Camera, config: ZoomConfig) {
        return new Promise((resolve, _) => {
            camera.zoomTo(config.zoom, config.duration, config.ease, config.force, (_, progress) => {
                if (progress == 1) resolve();
            });
        });
    }

    static fadeOut(camera: Phaser.Cameras.Scene2D.Camera, duration: number) {
        return new Promise((resolve, _) => {
            camera.fade(duration, 0, 0, 0, false, (camera, progress) => {
                if (progress == 1) resolve();
            });
        });
    }

    static fadeIn(camera: Phaser.Cameras.Scene2D.Camera, duration: number) {
        return new Promise((resolve, _) => {
            camera.fadeIn(duration, 0, 0, 0, (camera, progress) => {
                if (progress == 1) resolve();
            });
        });
    }
}