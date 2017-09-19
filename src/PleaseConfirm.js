import React from 'react';
import { Link } from 'react-router-dom'

const PleaseConfirm = () => (
  <div>
    <h2>Thanks for Signing Up</h2>
    <p>
      Please check the link we sent to your email address to verify your
      identity. Once you're confirmed, you may <Link to="/login">log in</Link>.
    </p>
  </div>
)

export default PleaseConfirm;
