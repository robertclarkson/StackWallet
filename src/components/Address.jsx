import React from 'react'
import PropTypes from 'prop-types'

const Address = ({ onClick, address, balance, transactions, id }) => (
  <tr>
    <td>
      {address}
    </td>
    <td>
      {balance}
    </td>
    <td>
      {transactions}
    </td>
  </tr>
)

Address.propTypes = {
  onClick:      PropTypes.func.isRequired,
  address:      PropTypes.string.isRequired
  balance:      PropTypes.string.isRequired
  transactions: PropTypes.string.isRequired
}

export default Address
