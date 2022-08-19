import React from 'react'
import { Row } from 'reactstrap'

import { LeftSection } from './left'
import { MainSection } from './main'

export const SectionContent = (props) => {
  return (
    <section className={`main-content ${props.hideDiv}`}>
      <div className="tsz-container">
        <Row>
          <LeftSection {...props}/>
          <MainSection />
        </Row>
      </div>
    </section>

  )
}