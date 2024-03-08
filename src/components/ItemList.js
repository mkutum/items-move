import React, { useEffect, useState } from 'react'
import { toWords } from 'number-to-words';
import { QrReader } from 'react-qr-reader';
import "./itemList.css";

const ItemList = () => {
    const [items, setItem] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [quantityText, setQuantityText] = useState('');
    const [QRvalue, setQRvalue] = useState('scan');
    const [openQR, setOpenQR] = useState(false);
    const [unit, setUnit] = useState(null);

    const handleQRscanner = () => {
        setOpenQR(!openQR);
    }
    console.log(items)
    const onSelectedItem = (value) => {
        setSelectedItem(value);
        value ? setUnit(items[value - 1].unit) : setUnit(null);
        setQuantity('');
        setQuantityText('');
        setOpenQR(false);
        setQRvalue('scan');
    }
    const handleQuantity = (e) => {

        const num = e.target.value;
        if (num === '') {
            console.log('inside closure')
            setQuantityText('');
            // return 0
        } else {
            setQuantity(parseInt(num));
            setQuantityText(toWords(parseInt(num)));
        }
        setQuantity(parseInt(num));
    }

    const handleItemsSubmit = () => {
        (!selectedItem || !items[selectedItem - 1].allowed_locations.includes(QRvalue)) ? alert("Sorry! Your location is not matching!") :
            fetch('https://api-staging.inveesync.in/test/submit', {
                method: 'POST',
                headers: { 'Content-type': 'application/json; charset=UTF-8' },
                body: JSON.stringify({
                    "id": parseInt(selectedItem),
                    "item_name": items[selectedItem - 1].item_name,
                    "location": QRvalue
                })
            })
                .then((response) => response.json())
                .then((data) => {
                    alert("Congratulation! You have moved the items to the new location")
                })
                .catch((error) => {
                    alert("Sorry! Your location is not matching!")
                    console.log(error.message);
                })

    }

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch('https://api-staging.inveesync.in/test/get-items')
                const data = await response.json();
                setItem(data)
            } catch (error) {
                console.log('Error capture', error)

            }
        };
        fetchItems();
    }, [])

    return (
        <>
            <div className='item-main'>
                <div className='item-outer'>
                    <div className='item-div'>
                        <label htmlFor='item_name'>Select item</label>
                        <select name='item_name' onChange={(e) => onSelectedItem(e.target.value)} value={selectedItem} required>
                            <option value="">Select an item</option>
                            {
                                items.map(data => (
                                    <option key={data.id} value={data.id}>
                                        {data.item_name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className='quantity-div'>
                        <div>
                            <label htmlFor='item-quantity'>Enter Quantity: </label>
                            <input type='number' name='item-quantity' value={quantity} onChange={handleQuantity} required />
                            <p className='num-text'>{quantityText.charAt(0).toUpperCase() + quantityText.slice(1)}</p>
                        </div>

                        <div>
                            <label htmlFor='item-unit'>Unit</label>
                            <input name='item-unit' value={unit} />
                            {/* items[selectedItem - 1].unit */}
                        </div>
                    </div>
                </div>

                <div className='item-qr'>
                    <label htmlFor='item-destination'>Destination Location</label>
                    <input name="item-destination" value={QRvalue} onClick={handleQRscanner} />
                    {
                        openQR && (
                            <QrReader
                                onResult={(result, error) => {
                                    if (!!result) {
                                        setQRvalue(result?.text);
                                    }
                                    if (!!error) {
                                        console.info(error);
                                    }
                                }}
                                style={{ width: '100%' }}
                            />
                        )
                    }

                </div>
                <div className='form-submit'>
                    <button type='submit' onClick={handleItemsSubmit}>Submit</button>
                </div>

            </div>
        </>
    )
}

export default ItemList