import RectSelect, { components } from 'react-select'
import React from 'react'

const colorStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: 'rgba(67,140,136,0.25)',
    border: 'none',
    borderRadius: '12px',
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: '#1B5759',
      color: '#FFFFFF',
      fontWeight: 600,
      padding: '8px 0px 8px 0px',
      borderBottom: '1px solid rgba(204,252,255,0.2)',
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }
  },
  singleValue: (styles) => {
    return {
      ...styles,
      color: 'white',
      paddingLeft: '10px',
    }
  },
  input: (styles) => {
    return {
      ...styles,
      color: 'white',
      paddingLeft: '10px',
    }
  },
  menu: (styles) => ({
    ...styles,
    backgroundColor: '#1B5759',
    borderRadius: '12px',
    padding: '12px 16px',
    position: 'absolute',
  }),
  menuList: (styles) => ({
    ...styles,
    maxHeight: '120px',
  }),
}
const IndicatorsContainer = (props) => {
  return (
    <div style={{ border: 'none' }}>
      <components.IndicatorsContainer {...props} />
    </div>
  )
}

function Select(props) {
  return (
    <RectSelect
      styles={colorStyles}
      components={{
        IndicatorSeparator: () => null,
        IndicatorsContainer,
      }}
      {...props}
    />
  )
}

export default Select
