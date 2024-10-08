
import { useState } from "react"
import "./pinIcon.css"

export const PinIcon = (props:{color:string}) => {

    const [isPinned, setIsPinned] = useState(false)

    const handleClick:React.MouseEventHandler<HTMLSpanElement> = (event) => {
        setIsPinned(!isPinned)
        event.stopPropagation()
        event.preventDefault()
    }
	
	return (
		<span
            className="material-symbols-outlined pinIcon"
            style={{color: props.color}}
            onClick={handleClick}
        >
			{isPinned ? "keep" : "keep_off"}
		</span>
	)

}