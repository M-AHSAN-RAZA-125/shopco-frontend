import React from 'react'
import './BrandName.css'
import versace from '../../assets/versace.png'
import zara from '../../assets/zara.png'
import gucci from '../../assets/gucci.png'
import prada from '../../assets/prada.png'
import calvin from '../../assets/calvin.png'

const BrandName = () => {
    return (
        <div className='black'>
            <img src={versace} alt="Versace" className="brands_logo" />
            <img src={zara} alt="Zara" className="brands_logo" />
            <img src={gucci} alt="Gucci" className="brands_logo" />
            <img src={prada} alt="Prada" className="brands_logo" />
            <img src={calvin} alt="Calvin Klein" className="brands_logo" />
        </div>
    )
}

export default BrandName