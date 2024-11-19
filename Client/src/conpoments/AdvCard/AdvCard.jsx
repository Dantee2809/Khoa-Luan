import React from 'react'
import './AdvCard.css'
import { AdvData } from '../../Data/AdvCard'
const AdvCard = () => {
  return (
    <div className="AdvCard">
      <h3>Quảng cáo</h3>
      {AdvData.map((adv) => {
        return (
          <div className="adv">
            <div>
              <img src={adv.img} alt=''
                className='advImg'
              />
            </div>
            <div className="advText">
              <span>{adv.ND}</span>
            </div>
          </div>
        )
      })}

    </div>
  )
}

export default AdvCard