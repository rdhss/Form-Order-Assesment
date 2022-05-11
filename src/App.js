import axios from 'axios';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useEffect, useState } from 'react';

function App() {
  const [nameList, setNameList] = useState()
  const [dataPrice, setDataPrice] = useState({})
  const [note, setNote] = useState("")
  const { register, handleSubmit, getValues, control, setValue, watch, formState: { errors } } = useForm()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "AllList"
  })


  // PRODUCT LIST
  const productList = [
    { product_name: "Morning Dew Milk", units: [{ name: "pak", price: 10000 }, { name: "pcs", price: 1000 }, { name: "karton", price: 15000 }] },
    { product_name: "Le Mineral 600ml", units: [{ name: "pak", price: 30000 }, { name: "pcs", price: 3000 }] },
    { product_name: "Greenfields Full Cream Milk 1L", units: [{ name: "karton", price: 25000 }, { name: "pcs", price: 2000 }] }
  ]


  // INPUT VALUE LIST
  const name = watch('name')
  const dist = watch('dist')
  const paymenType = watch('paymenType')
  const dateExp = watch('dateExp')
  const product = watch('product')
  const quantity = watch('quantity')
  const unit = watch('unit')
  const prices = watch('price')

  // FETCH DATA
  useEffect(() => {
    axios.get('https://61a8198c387ab200171d2faf.mockapi.io/clickdaily')
      .then((res) => {
        setNameList(res.data[0].data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  // Function
  const price = (product, unit) => {
    let filter = productList.filter(item => item.product_name === product)
    let price = filter.map(item => item.units.filter(item => item.name === unit))[0][0].price
    return price
  }


  return (
    <div className="px-5 py-5">
      <h1 className='mb-5'>Create Order</h1>
      <form onSubmit={handleSubmit((data) => {
        console.log(data)
        console.log(`note : "${note}"`)
        console.log(`total price : ${Object.values(dataPrice).reduce((a, b) => a + b, 0)}`)
      })}>
        <section id='Detail' className='detail'>

          <h4 className='title-detail'>Detail</h4>
          <div className="form-group w-75">

            {/* NAME */}
            <label >Name <span className='text-danger'>*</span></label>
            <select className="form-control w-50"  {...register("name", { required: "required" })}>
              <option value="" disabled selected hidden>Name</option>
              {nameList?.map(item => <option >{item.employee_name}</option>)}
            </select>
            <p className='text-danger mt-1'>{errors.name?.message}</p>

            {/* DIST */}
            <label className='mt-3'>Distribution Center <span className='text-danger'>*</span></label>
            <select className="form-control w-50" {...register("dist", { required: "required" })}>
              <option value="" disabled selected hidden>Distribution Center</option>
              {name === '' ?
                <option disabled>No data available.</option>
                :
                <>
                  <option>DC Tangerang</option>
                  <option>DC Cikarang</option>
                </>
              }
            </select>
            <p className='text-danger mt-1'>{errors.dist?.message}</p>
            {name && dist ?
              <div className="row mt-5">
                <div className="col">

                  {/* PAYMENT TYPE */}
                  <label>Payment Type <span className='text-danger'>*</span></label>
                  <select className="form-control"  {...register("paymenType", { required: "required" })}>
                    <option value="" disabled selected hidden>Payment Type</option>
                    <option>Cash H+1</option>
                    <option>Cash H+3</option>
                    <option>Cash H+7</option>
                    <option>Transfer H+1</option>
                    <option>Transfer H+3</option>
                    <option>Transfer H+7</option>
                  </select>
                  <p className='text-danger mt-1'>{errors.paymenType?.message}</p>
                </div>
                <div className="col">

                  {/* DATE EXP */}
                  <label>Expired Date <span className='text-danger'>*</span></label>
                  <input type="date" className="form-control" placeholder="Last name"  {...register("dateExp", { required: "required" })} />
                  <p className='text-danger mt-1'>{errors.dateExp?.message}</p>
                </div>
                <div className="form-group mt-3">

                  {/* NOTES */}
                  <label>Notes</label>
                  <textarea onChange={(e) => setNote(e.target.value)} className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                </div>
              </div>
              :
              null
            }
          </div>
        </section>
        {name && dist ?
          <section id='Product' className='product mt-5'>
            <h4 className='title-detail'>Detail</h4>
            <div className="form-group w-75">
              <div className="row">
                <div className="col-8">

                  {/* PRODUCT */}
                  <label>Product <span className='text-danger'>*</span></label>
                  <select className="form-control"  {...register("product", { required: "required" })}>
                    <option value="" disabled selected hidden>Product</option>
                    {productList?.map(item => <option >{item.product_name}</option>)}
                  </select>
                </div>
                <div className="col-4">
 
                  {/* UNITS */}
                  <label>Unit <span className='text-danger'>*</span></label>
                  <select className="form-control" {...register("unit", {
                    required: "required", onChange: (e) => {
                      setValue('price', price(product, e.target.value))
                      setValue('quantity', '')
                      setValue('totalPrice', '')
                    }
                  })}>
                    <option value="" disabled selected hidden>Unit</option>
                    {product === '' || product === undefined ?
                      <option disabled>No data available.</option>
                      :
                      <>
                        {productList.filter(item => item.product_name === product).map(item => item.units.map(item => <option
                        >
                          {item.name}
                        </option>))}
                      </>
                    }
                  </select>

                </div>
              </div>
              <div className="row mt-3">
                <div className="col-3">

                  {/* QUANTITY */}
                  <label>Quantity <span className='text-danger'>*</span></label>
                  <input type="number" {...register("quantity", {
                    required: "required", onChange: (e) => {
                      setValue('totalPrice', e.target.value * prices)
                      setDataPrice({...dataPrice, priceMain : e.target.value * prices})
                    }
                  })} className="form-control" min={1} />
                  <p className='text-danger mt-1'>{errors.quantity?.message}</p>
                </div>
                <div className="col-3">

                  {/* PRICE */}
                  <label>Price <span className='text-danger'>*</span></label>
                  <fieldset disabled>
                    <input type="number" className="form-control price"  {...register("price")} />
                  </fieldset>

                </div>
                <div className="col-6 position-relative">

                  {/* TOTAL PRICE */}
                  <label className='text-end w-100'> Total Price <span className='text-danger'>*</span></label>
                  <fieldset disabled>
                    <input type="number" {...register("totalPrice", { onChange: (e) => { console.log(e) } })} className="form-control text-end " />
                  </fieldset>
                </div>
              </div>
              <div className='w-100 d-flex align-items-end flex-column'>
                <hr className='w-50' />
                <div className='w-50 d-flex justify-content-between'>
                  <h5>Total Nett Price</h5>
                  <h5>{unit !== undefined && product !== undefined && unit !== '' && product !== '' ? watch('price') * watch('quantity') : 0}</h5>
                </div>
              </div>

              {/* ADD ITEM */}
              {fields.map(({ id }, index) => {
                return (
                  <div key={id} className="mt-5">
                    <div className="row">
                      <div className="col-8 position-relative">

                        {/* PRODUCT */}
                        <button className='round' onClick={() => {
                        remove(index)
                        setDataPrice({...dataPrice, [index] : 0})
                      }
                        }>-</button>
                        <label>Product <span className='text-danger'>*</span></label>
                        <select className="form-control"  {...register(`AllList.${index}.product`, { required: "required" })}>
                          <option value="" disabled selected hidden>Product</option>
                          {productList?.map(item => <option >{item.product_name}</option>)}
                        </select>
                      </div>
                      <div className="col-4">

                        {/* UNIT */}
                        <label>Unit <span className='text-danger'>*</span></label>
                        <select className="form-control" {...register(`AllList.${index}.unit`, {
                          required: "required", onChange: (e) => {
                            setValue(`AllList.${index}.price`, price(watch(`AllList.${index}.product`), e.target.value))
                            setValue(`AllList.${index}.quantity`, '')
                          }
                        })}>
                          <option value="" disabled selected hidden>Unit</option>
                          {watch(`AllList.${index}.product`) === "" || watch(`AllList.${index}.product`) === undefined ?
                            <option disabled>No data available.</option>
                            :
                            <>
                              {productList.filter(item => item.product_name === watch(`AllList.${index}.product`)).map(item => item.units.map(item => <option>{item.name}</option>))}
                            </>
                          }
                        </select>
                        <p className='text-danger mt-1'>{errors.allList?.message}</p>
                        
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-3">

                        <label>Quantity <span className='text-danger'>*</span></label>
                        <input type="number" {...register(`AllList.${index}.quantity`, { required: "required", onChange: (e) => {
                          setDataPrice({...dataPrice,  [index] : e.target.value * watch(`AllList.${index}.price`)})
                        }})} className="form-control" min={1} />
                        <p className='text-danger mt-1'>{errors.quantity?.message}</p>
                      </div>
                      <div className="col-3">
                        <label>Price <span className='text-danger'>*</span></label>
                        <fieldset disabled>
                          <input type="number" className="form-control price"  {...register(`AllList.${index}.price`)} />
                        </fieldset>
                      </div>
                      <div className="col-6">
                        <label className='text-end w-100'> Total Price<span className='text-danger'>*</span></label>
                        <fieldset disabled>
                          <input type="text" {...register(`AllList.${index}.totalPrices`, { required: 'required' })} className="form-control text-end" value={watch(`AllList.${index}.unit`) !== undefined && watch(`AllList.${index}.product`) !== undefined && watch(`AllList.${index}.price`) !== '' && watch(`AllList.${index}.quantity`) !== '' ? Number(getValues(`AllList.${index}.quantity`)) * Number(getValues(`AllList.${index}.price`)) : 0} />
                        </fieldset>
                      </div>
                    </div>
                    <div className='w-100 d-flex align-items-end flex-column'>
                      
                      <hr className='w-50' />
                      <div className='w-50 d-flex justify-content-between'>
                        <h5>Total Nett Price</h5>
                        <h5>{watch(`AllList.${index}.unit`) !== undefined && watch(`AllList.${index}.product`) !== undefined && watch(`AllList.${index}.price`) !== '' && watch(`AllList.${index}.quantity`) !== '' ? Number(getValues(`AllList.${index}.quantity`)) * Number(getValues(`AllList.${index}.price`)) : 0}</h5>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div className='mt-5'>
                <button type="button" className="btn btn-warning text-light" onClick={() => append({})}>NEW ITEM +</button>
                <div className='w-100 d-flex align-items-end flex-column'>
                  <div className='w-50 d-flex justify-content-between'>
                    <h5>Total</h5>
                    <h5>{Object.values(dataPrice).reduce((a, b) => a + b, 0)}</h5>
                  </div>
                </div>
              </div>
            </div>
          </section>
          :
          null
        }
        <hr />
        <div className='d-flex mt-1 justify-content-end'>
          <button onClick={() => window.location.reload()} className="btn btn-light">Cancel</button>
          <button type="submit" className="btn btn-success" >Confirm</button>
        </div>
      </form>
    </div>
  );
}

export default App;
