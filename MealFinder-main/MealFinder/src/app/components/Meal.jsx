import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import MealItem from "";
import RecipeIndex from "./RecipeIndex";
const Meal=()=>{
    const [url,setUrl]=useState("https:/www.themealdb.com/api/json/v1/1/search.php?f=a");
    const [item, setItem]=useState();
    const [show,setShow]=useState(false);
    useEffect(()=>{
        fetch(url).then(res=>res.json()).then(data=>{
            console.log(data.meals);
            setItem(data.meals);
            setShow(true);
        })
    },[url])

    const setIncdex=(alpha)=>{
        setUrl(`https:/www.themealdb.com/api/json/v1/1/search.php?f=${alpha}`)
    }
    return(
        <>
            <div className="main">
                <div className="heading">
                    <h1>Seatt</h1>
                    <h4>fidfdfijdf</h4>
                </div>
            </div>
            <div className="searchBox">
                <input type="searchBox" className="search-bar"/>
            </div>
            <div className="container">
                {
                    show ? <MealItem data={item}/>:"Not Found"
                }
            </div>
            <div className="indexContainer">
                <RecipeIndex alphaIndex={(alpha)=>setIncdex(alpha)}/>
            </div>
        </>
    )
}