import React from "react";
import { useParams,useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import axios from "axios";
function UpdateUser(){
    const {id}=useParams();
    const [publisher, setPublisher] =useState("");
    const [book, setBook] =useState("");
    const [date, setDate] =useState("");
    const navigate=useNavigate();
    useEffect(()=>{
        axios.get("http://localhost:3001/getUser/"+id)
        .then(result=>{
            console.log(result)
            setPublisher(result.data.publisher)
            setBook(result.data.book)
            setDate(result.data.date?.split('T')[0])
        })
        .catch(err=>console.log(err))
    },[])
    const Update=(e)=>{
        e.preventDefault();
        axios.put("http://localhost:3001/updateUser/"+id,{publisher, book, date})
        .then(result=>{
            console.log(result)
            navigate("/main")
        }
        )
        .catch((err)=>console.log(err))
    }
    return(
        <div className="page-container">
            <h1>Book Management System</h1>
            <div className="content-container">
                <div className="bg-white p-3 rounded w-75">
                    <form onSubmit={Update} noValidate>
                        <h2>Update Book</h2>
                        <div className="mb-2">
                            <label htmlFor="pub" >Publisher</label>
                            <input type="text" required id="pub" className="form-control"  placeholder="Enter Publisher" value={publisher} onChange={(e)=>setPublisher(e.target.value)}/>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="book">Book Name</label>
                            <input type="text" required id="book" className="form-control"  placeholder="Enter Book Name" value={book} onChange={(e)=>setBook(e.target.value)}/>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="date" >Date</label>
                            <input type="date" required id="date" className="form-control"  placeholder="Enter Date" value={date} onChange={(e)=>setDate(e.target.value)}/>
                        </div>
                        <button className="btn btn-success">Update</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default UpdateUser; 