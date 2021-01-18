import React from 'react'
import PropTypes from 'prop-types'

export function Circle( props ) {
    Circle.propTypes = {
        x: PropTypes.number,
        y: PropTypes.number
    }
    return <circle
        cx = { 200 * props.x + 100 }
        cy = { 200 * props.y + 100 }
        r = { 80 } >

    </circle>
}
