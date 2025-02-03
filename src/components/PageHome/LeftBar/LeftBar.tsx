import { useState } from "react"
import { LeftBarSmall } from "./LeftBarSmall"
import { LeftBarBig } from "./LeftBarBig"
import { MidTitle } from "./SmallMidTitle"

export const LeftBar = () => {

    const [increasedMiddleSize, setIncreasedMiddleSize] = useState(false)

    return (
        <div
            className="vertical-middle"
            style={{
                width: increasedMiddleSize
                    ? "100%"
                    : undefined,
                transition: "width 0.5s",
            }}
        >

            <MidTitle
                increasedMiddleSize={increasedMiddleSize}
                setIncreasedMiddleSize={setIncreasedMiddleSize}
            />

            {increasedMiddleSize && <LeftBarBig />}
            {!increasedMiddleSize && <LeftBarSmall />}

        </div>
    )
}
