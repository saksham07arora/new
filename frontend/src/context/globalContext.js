import React, { useContext, useState } from "react"
import axios from 'axios'
import { useMsal } from '@azure/msal-react';

const BASE_URL = "http://localhost:5000/api/v1/";


const GlobalContext = React.createContext()

export const GlobalProvider = ({children}) => {

    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const { instance, accounts } = useMsal();

    //calculate incomes
    const addIncome = async (income) => {
        console.log(accounts[0].username);
        if(accounts.length > 0){
            income['user'] = accounts[0].username;
            const response = await axios.post(`${BASE_URL}add-income`, income)
            .catch((err) =>{
                setError(err.response.data.message)
            })
        }
        getIncomes()
    }

    const getIncomes = async () => {
        if(accounts.length > 0){
            const id = accounts[0].username;
            const response = await axios.get(`${BASE_URL}get-incomes/${id}`)
            setIncomes(response.data)
            console.log( "get income",response.data)
        }
        
    }

    const deleteIncome = async (id) => {
        const res  = await axios.delete(`${BASE_URL}delete-income/${id}`)
        getIncomes()
    }

    const totalIncome = () => {
        let totalIncome = 0;
        incomes.forEach((income) =>{
            totalIncome = totalIncome + income.amount
        })

        return totalIncome;
    }


    //calculate incomes
    const addExpense = async (income) => {
        if(accounts.length > 0){
            income['user'] = accounts[0].username;
            const response = await axios.post(`${BASE_URL}add-expense`, income)
            .catch((err) =>{
                setError(err.response.data.message)
            })
        }
        getExpenses()
    }

    const getExpenses = async () => {
        if(accounts.length > 0)
        {
            const id = accounts[0].username;
            const response = await axios.get(`${BASE_URL}get-expenses/${id}`)
            setExpenses(response.data)
            console.log(response.data)
        }
        
    }

    const deleteExpense = async (id) => {
        const res  = await axios.delete(`${BASE_URL}delete-expense/${id}`)
        getExpenses()
    }

    const totalExpenses = () => {
        let totalIncome = 0;
        expenses.forEach((income) =>{
            totalIncome = totalIncome + income.amount
        })

        return totalIncome;
    }


    const totalBalance = () => {
        return totalIncome() - totalExpenses()
    }

    const transactionHistory = () => {
        const history = [...incomes, ...expenses]
        history.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })

        return history.slice(0, 3)
    }
    const getCategoryTotals = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-category-totals`);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching category totals');
            return [];
        }
    };

    
    

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            setError,
            getCategoryTotals,
            isLoggedIn,
            setIsLoggedIn,
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () =>{
    return useContext(GlobalContext)
}