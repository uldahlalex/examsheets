import {type Sheet, SheetsAtom} from "./SheetsAtom.tsx";
import {useAtom} from "jotai";
import {createBrowserRouter, Outlet, RouterProvider, useNavigate} from "react-router";
import SheetComponent from "./SheetComponent.tsx";

export default function App() {
    
    
    
    return <div>
        <RouterProvider router={createBrowserRouter([
            {
                path: '',
                element: <Home />,
                children: [
                    {
                        element: <SheetComponent />,
                        path: '/:sheetId'
                    }
                ]
            }
            
        ])} />

    
        
        
    </div>;
}

export function Home() {
    const [sheets, setSheets] = useAtom(SheetsAtom);
    const navigate = useNavigate();
    return <>
  
        <div className=" join">            
            <div className="flex flex-col">Vælg en eksamens-sæson:</div>

            {
            sheets.map(sheet => 
                <span key={sheet.name} className="">
                    <div>{sheet.name}</div>
                    <button className="btn btn-accent join-item" onClick={() => {
                    navigate('/'+sheet.name)
                }}>Gå til</button>
                    <button className="btn btn-accent join-item" onClick={() => {
                        const d1: Sheet = {...sheet, name: sheet.name+crypto.randomUUID()}

                        const duplicate = [...sheets, d1];
                        setSheets(duplicate)
                    }}>Dupliker</button>
                    <button  className="btn btn-error join-item" onClick={() => {
                        setSheets(sheets.filter(s => s.name !== sheet.name))
                    }}>Slet</button>
                </span>
                
           )
            
        }</div>
      
        <Outlet />

    </>
}