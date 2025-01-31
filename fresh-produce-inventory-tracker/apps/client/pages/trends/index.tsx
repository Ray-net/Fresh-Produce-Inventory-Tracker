// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable-next-line */
// react plugin used to create charts
import { useState } from "react";
import {Chart} from "./../../src/components/chart/chart"
import { options } from '../api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import { useSession } from 'next-auth/react';

const FreshProduce = [];
const PoultryMeat = [];
const Pastries = [];
const lineData = [];

const tableYear_api = `http://13.246.26.157:3333/api/trendforyear/getmonthaverages`;

const option = [
  "All","Fruit&Veg","Meat","Pastries"
];

export interface InventoryProps {
  type:string
}

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    options
  );

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  let Form = "userid=" + session.user?.id?.toString() + "&producetype=Fresh Produce";

  let responses = await fetch(tableYear_api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: Form,
  });

  let trendDatas = await responses.json();

  if(responses.status == 201)
  {
    for(let x = 0;x < Object.values(trendDatas)[2].length;x++)
    {
      FreshProduce.push(Object.values(trendDatas)[2][x]);
    }
  }

  Form = "userid=" + session.user?.id?.toString() + "&producetype=Poultry/Meat";

  responses = await fetch(tableYear_api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: Form,
  });

  trendDatas = await responses.json();

  if(responses.status == 201)
  {
    for(let x = 0;x < (Object.values(trendDatas)[2]).length;x++)
    {
      PoultryMeat.push(Object.values(trendDatas)[2][x]);
    }
  }

  Form = "userid=" + session.user?.id?.toString() + "&producetype=Pastries";

  responses = await fetch(tableYear_api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: Form,
  });

  trendDatas = await responses.json();

  if(responses.status == 201)
  {
    for(let x = 0;x < Object.values(trendDatas)[2].length;x++)
    {
     Pastries.push(Object.values(trendDatas)[2][x]);
    }
  }

  return {
    props:{FreshProduce,PoultryMeat,Pastries,lineData}
  }
}

export function Trends({FreshProduce,PoultryMeat,Pastries,lineData},props:InventoryProps) {
  const { data: session } = useSession();
  let x = 0;
  const [type, setType] = useState("Bar");
  const [produce, setProduce] = useState("Fruit");
  const [FP, setFP] = useState(FreshProduce);
  const [M, setM] = useState(PoultryMeat);
  const [P, setP] = useState(Pastries);

  const filter = async (event) => {
    if(event.target.value != "All")
    {
      setType("Line");
      if(event.target.value == "Fruit&Veg")
      {
        lineData = FreshProduce;
        setProduce("Fruit & Veg");
      }
      else if(event.target.value == "Meat")
      {
        lineData = PoultryMeat;
        setProduce("Meat");
      }
      else
      {
        lineData = Pastries;
        setProduce("Pastries");
      }
    }
    else
    {
      setType("Bar");
    }
  }

  const fetchData = async () => {
    FreshProduce = [];
    PoultryMeat = [];
    Pastries = [];

    let Form = "userid=" + session.user?.id?.toString() + "&producetype=Fresh Produce";

    let responses = await fetch(tableYear_api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: Form,
    });

    let trendDatas = await responses.json();

    if(responses.status == 201)
    {
      for(let x = 0;x < Object.values(trendDatas)[2].length;x++)
      {
        FreshProduce.push(Object.values(trendDatas)[2][x]);
      }
    }

    Form = "userid=" +  session.user?.id?.toString() + "&producetype=Poultry/Meat";

    responses = await fetch(tableYear_api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: Form,
    });

    trendDatas = await responses.json();

    if(responses.status == 201)
    {
      for(let x = 0;x < (Object.values(trendDatas)[2]).length;x++)
      {
        PoultryMeat.push(Object.values(trendDatas)[2][x]);
      }
    }

    Form = "userid=" + session.user?.id?.toString() + "&producetype=Pastries";

    responses = await fetch(tableYear_api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: Form,
    });

    trendDatas = await responses.json();

    if(responses.status == 201)
    {
      for(let x = 0;x < Object.values(trendDatas)[2].length;x++)
      {
        Pastries.push(Object.values(trendDatas)[2][x]);
      }
    }
    setFP(FreshProduce);
    setM(PoultryMeat);
    setP(Pastries);
  }

  function stateChange() {
    setTimeout(function () {
        fetchData();
        stateChange();
    }, 15000);
  }

  stateChange();

  return (
      <div>
      <div className="grid content-center grid-cols-6 m-2">
        <div className="col-span-2">
          <h1>Average Sales</h1>
        </div>
        <div className="col-span-5"></div>
        <div>
        <select onChange={filter} className="m-1 text-white btn btn-primary">
            {option.map(option => (
              <option key={x++} value={option} className="p-4 space-y-4 text-white shadow dropdown-content bg-neutral menu rounded-box w-52">{option}</option>
            ))}
          </select>
        </div>
      </div>
      <Chart lineData={lineData} type={type} fruit={produce} data={[FP,M,P]}></Chart>
    </div>
  );
}

export default Trends;
