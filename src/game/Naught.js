import React from 'react'
import PropTypes from 'prop-types'

export function Naught( props ) {
    Naught.propTypes = {
        x: PropTypes.number,
        y: PropTypes.number
    }
    return <circle
        cx = { 200 * props.x + 100 }
        cy = { 200 * props.y + 100 }
        r = { 80 } >

    </circle>
}
