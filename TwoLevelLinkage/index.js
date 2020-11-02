import React, { useEffect, useState, useRef } from 'react';
import './index.less';
/* props参数：
* data=Array
* firstLevelTitle="品牌"
* placeholderText="ok"
* threeLevelTitle='已选'
* secondaryTitle="机型"
*/
const DropDown = (props) => {
    const [placeholderText, setPlaceholderText] = useState('点击选择地域（如不选择默认全国）')
    const [tranStatus, setTranStatus] = useState(false);//下拉状态 默认false 不显示
    const [code, setCode] = useState([]);//存省ID
    const [cityCode, setCityCode] = useState([]);//省ID对应的项
    const [checkCode, setCheckCode] = useState([]);//市ID
    const [checkCityCode, setCheckCityCode] = useState([]);//市ID对应的项
    const transImg = useRef(null);


    const handleClose = (e) => {
        console.log(typeof e.target.className, '----', e.target.className, 'eeee')
        if (typeof e.target.className == 'string' && e.target.className.includes('el')) return;
        setTranStatus(false);
        setPlaceholderText(props.placeholderText ? props.placeholderText : '点击选择地域（如不选择默认全国）');
        // if (!e.target.className.includes('el') || e.target.className == '') {
        //     setTranStatus(false);
        //     setPlaceholderText(props.placeholderText ? props.placeholderText : '点击选择地域（如不选择默认全国）');
        // }
    }
    useEffect(() => {
        if (props.placeholderText) setPlaceholderText(props.placeholderText);
        let doc = document.addEventListener('click', handleClose);
        return () => document.removeEventListener('click', handleClose);
    }, [])
    const handleDel = (e, itemCode) => {
        let cityCode = checkCode.find(i => {
            if (i == itemCode.code) return i;
        })
        if (cityCode) {
            let newCheckCode = checkCode.filter(i => i !== cityCode);
            let newCheckCityCode = checkCityCode.filter(i => i.code !== cityCode);
            setCheckCode(newCheckCode);
            setCheckCityCode(newCheckCityCode);
        }
    }
    //点击input框
    const handleInput = () => {
        setTranStatus(!tranStatus);
        //设置placeholder为空
        tranStatus ? setPlaceholderText(props.placeholderText ? props.placeholderText : '点击选择地域（如不选择默认全国）') : setPlaceholderText('');
    }
    //选择市
    const handleCityCheck = (c) => {
        let cityObj = props.data.find(i => {
            if (i.code == c) return i;
        });
        setCityCode([...cityCode, ...cityObj.citys]);
    }

    //1 选择省
    const handleProvince = (c) => {
        //选择省份前 先看看是否已经选中 如果选中返回选中的
        let f = code.find(item => {
            if (item == c) return c;
        });
        //如果选中 需要过滤掉这项
        if (f) {
            let filtercode = code.filter(i => i !== f);
            let newCityCode = cityCode.filter(it => it.provinceCode !== c);
            setCode(filtercode);
            setCityCode(newCityCode);
            return;
        }
        //如果没选择 选中添加
        setCode([...code, c]);
        handleCityCheck(c);
    }

    //check
    const handleCheckCity = (c) => {
        console.log(cityCode, '2222')
        let cityObj = cityCode.find(i => {
            if (i.code == c) return i;
        });
        console.log(cityObj, '3333')
        setCheckCityCode([...checkCityCode, cityObj]);
    }
    //选择市
    const handleCity = (e, c) => {
        console.log(c, '1235')
        e.stopPropagation();
        //选择市份前 先看看是否已经选中 如果选中返回选中的
        let f = checkCode.find(item => {
            if (item == c) return c;
        });
        //如果选中 需要过滤掉这项
        if (f) {
            let filterCheckCode = checkCode.filter(i => i !== f);
            let newCityCode = checkCityCode.filter(it => it.code !== c);
            setCheckCode(filterCheckCode);
            setCheckCityCode(newCityCode);
            return;
        }
        //如果没选择 选中添加
        setCheckCode([...checkCode, c]);
        handleCheckCity(c);
    }

    return (
        <>
            <div className='cwtbox'>
                <div style={checkCityCode.length > 0 ? { display: 'flex' } : { display: 'none' }} className='v_inpt el' onClick={handleInput}>
                    {
                        checkCityCode.map((v, l) => {
                            return <li className='checkcitylibox el vtagbox' key={l}>
                                <span className='el'>{v.city}</span>
                                <span className='dels el vdel'>X</span>
                                {/* <img onClick={alert(1)} src='../../../assets/images/del.png'></img> */}
                            </li>
                        })
                    }
                </div>

                <input style={checkCityCode.length > 0 ? { display: 'none' } : { display: 'flex' }} ref={transImg} className='cwt_select el' onClick={handleInput} placeholder={placeholderText} />
                <img style={{ transform: tranStatus ? 'rotate(0deg)' : 'rotate(180deg)' }} className='cwt_jt el' src='../../../assets/images/tr.png'></img>
                <main className='secmain el'>
                    <section style={{ display: tranStatus ? 'block' : 'none' }} className='cwt_sectionbox1 el'>
                        <p className='sec_p1 el'>{props.firstLevelTitle ? props.firstLevelTitle : '省份'}</p>
                        <ul className='sec_ul el'>
                            {
                                props.data.map((i, d) => {
                                    return <li className='el' style={code.includes(i.code) ? { backgroundColor: '#1890ff', color: '#fff' } : null} onClick={() => handleProvince(i.code)} data-code={i.code} key={i.code}>{i.province}</li>
                                })
                            }
                        </ul>
                    </section>

                    <section style={{ display: tranStatus ? 'block' : 'none' }} className='cwt_sectionbox1 el'>
                        <p className='sec_p1 el'>{props.secondaryTitle ? props.secondaryTitle : '市区'}</p>
                        <ul className='sec_ul el'>
                            {
                                cityCode.map((ichild, iindex) => {
                                    return <li className='el' style={checkCode.includes(ichild.code) ? { backgroundColor: '#1890ff', color: '#fff' } : null} onClick={(e) => handleCity(e, ichild.code)} key={iindex}>{ichild.city}</li>
                                })
                            }
                        </ul>
                    </section>

                    <section style={{ display: tranStatus ? 'block' : 'none' }} className='cwt_sectionbox1 el'>
                        <p className='sec_p1 el'>{props.threeLevelTitle ? props.threeLevelTitle : '已选择'}</p>
                        <ul className='sec_ul el'>
                            {
                                checkCityCode.map((icode, icd) => {
                                    return <li className='checkcitylibox el' key={icd}>
                                        <span className='el'>{icode.city}</span>
                                        <span className='dels el' onClick={(e) => handleDel(e, icode)}>X</span>
                                        {/* <img onClick={alert(1)} src='../../../assets/images/del.png'></img> */}
                                    </li>
                                })
                            }
                        </ul>
                    </section>
                </main>
            </div>
        </>
    )
}

export default DropDown;