import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import AddCar from './AddCar';
import EditCar from './EditCar';

import Snackbar from '@material-ui/core/Snackbar';



function Carlist() {

    const [cars, setCars] = useState([]);

    const [open, setOpen] = React.useState(false);

    const [msg, setMsg] = useState('');

    const openSnackBar = () => {
        setOpen(true);
    }

    const closeSnackBar = () => {
        setOpen(false);
    }


    const fetchCars = () => {
        fetch('http://carrestapi.herokuapp.com/cars')
            .then(response => response.json())
            .then(data => setCars(data._embedded.cars))
            .catch(err => console.error(err))
    }

    useEffect(() => {
        fetchCars();
    }, []);

    const deleteCar = (url) => {
        if (window.confirm('Are you sure')) {
            fetch(url, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        setMsg('Car deleted successfully')
                        openSnackBar();
                        fetchCars();
                    }
                    else {
                        alert('Something went wrong');
                    }
                })
                .catch(err => console.error(err));
        }
    }

    const addCar = (newCar) => {

        fetch('http://carrestapi.herokuapp.com/cars', {
            method: 'POST',
            body: JSON.stringify(newCar),
            headers: { 'Content-type': 'application/json' }
        })
            .then(response => {
                if (response.ok)
                    fetchCars();
                else
                    alert('Something went wrong')
            })
            .catch(err => console.error(err))
    }

    const editCar = (url, updatedCar) => {
        fetch(url, {
            method: 'PUT',
            body: JSON.stringify(updatedCar),
            headers: { 'Content-type': 'application/json' }

        })

            .then(response => {
                if (response.ok)
                    fetchCars();
                else
                    alert('Something went wrong in update');
            })

            .catch(err => console.error(err))
    }
    const columns = [
        { field: 'brand', sortable: true, filter: true },
        { field: 'model', sortable: true, filter: true },
        { field: 'color', sortable: true, filter: true },
        { field: 'fuel', sortable: true, filter: true },
        { field: 'year', sortable: true, filter: true, width: 100 },
        { field: 'price', sortable: true, filter: true, width: 100 },
        {
            headerName: '',
            width: 100,
            field: '_links.self.href',
            cellRendererFramework: params => < EditCar editCar={editCar} link={params.value} car={params.data} />
        },
        {
            headerName: '',
            width: 100,
            field: '_links.self.href',
            cellRendererFramework: params =>
                <IconButton color="secondary" onClick={() => deleteCar(params.value)}>
                    <DeleteIcon />
                </IconButton>
        }

    ];

    return (
        <div>
            <AddCar addCar={addCar} />
            <div className="ag-theme-material" style={{ height: 600, width: '90%', margin: 'auto' }}>
                <AgGridReact
                    rowData={cars}
                    columnDefs={columns}
                    pagination={true}
                    paginationPageSize={10}
                    suppressCellSelection={true}
                />
            </div>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                message={msg}
                onClose={closeSnackBar}
            />
        </div>
    )
}

export default Carlist;