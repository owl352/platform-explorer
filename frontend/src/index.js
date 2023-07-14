import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import HomeRoute, {loader as homeLoader} from "./routes/home/home.route";
import BlockRoute, {
    loader as blockLoader,
} from "./routes/block/block.route";
import ErrorPage from "./routes/error/error.route";
import RootComponent from "./components/RootComponent";
import BlocksRoute, {loader as blocksLoader} from "./routes/blocks/blocks.route";
import TransactionRoute, {
    loader as transactionLoader,
} from "./routes/transaction/transaction.route";
import TransactionsRoute from "./routes/transactions/tranactions.route";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootComponent/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                index: true,
                element: <HomeRoute/>,
                loader: homeLoader,
            },
            {
                path: "blocks",
                element: <BlocksRoute/>,
                loader: blocksLoader,
            },
            {
                path: "block/:hash",
                element: <BlockRoute/>,
                loader: blockLoader,
            },
            {
                path: "transaction/:txHash",
                element: <TransactionRoute/>,
                loader: transactionLoader,
            },
            {
                path: "transactions",
                element: <TransactionsRoute/>,
            },
        ]
    }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
