
import { UserAction_t } from "./ActionRecorder";

export class ActionReplayer {

    public static replay(actions: UserAction_t[]) {

        let step = 0;

        function replayStep() {
            if (step >= actions.length) {
                return;
            }

            const action = actions[step];
            const data = action.data;

            switch (action.action) {
                case "keydown":
                    window.dispatchEvent(new KeyboardEvent("keydown", {
                        key: data.key,
                        code: data.code
                    }));
                    break;
                case "keyup":
                    window.dispatchEvent(new KeyboardEvent("keyup", {
                        key: data.key,
                        code: data.code
                    }));
                    break;
                case "mousedown":
                    window.dispatchEvent(new MouseEvent("mousedown", {
                        clientX: data.clientX,
                        clientY: data.clientY
                    }));
                    break;
                case "mouseup":
                    window.dispatchEvent(new MouseEvent("mouseup", {
                        clientX: data.clientX,
                        clientY: data.clientY
                    }));
                    break;
                case "mousemove":
                    window.dispatchEvent(new MouseEvent("mousemove", {
                        clientX: data.clientX,
                        clientY: data.clientY
                    }));
                    break;
            }

            step++;
            setTimeout(replayStep, 0);
        }

    }


}
