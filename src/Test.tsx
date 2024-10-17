import { Button } from "@mui/material";
import { Retry, wait } from "./Retry";

const Try = new Retry("test")
    .add(() => {
        throw "fail 1"
    }).add(() => {
        throw "fail 2"
    }).add(async (f) => {
        f.considerFailed = true;
        window.location.reload();
        await wait(2000);
    }).add(() => {
        alert("ok")
    })

export const C = () => {
    return <Button onClick={async () => {
        Try.run()
    }
    }>
        Lol
    </Button>
}