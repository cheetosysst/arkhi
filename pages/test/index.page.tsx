import React from 'react'
import './code.css'
import { Link } from '@arkhi/core';

import './code.css'
export { Page }

function Page() {
  console.log("prefetch Test!");
  return (
    <>
      <h1>Test</h1>
      <p>
        Test prefetch here.
      </p>
      <Link href="/">
        To Home
      </Link >
    </>
  )
}
