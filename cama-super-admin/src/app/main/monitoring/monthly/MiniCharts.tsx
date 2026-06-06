import Mini from "./miniChart/Mini";

// private String yearMonth;            //년월
// private String churnRate;            //이탈율
// private String dau;                  //Dau
// private String mau;                  //Mau
// private String ancrageRate;          //고착도

export default function MiniCharts(props: { data: any }) {
  const { categories, churnRate, dau, mau, ancrageRate } = props.data;

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <div className="shadow-sm border border-mainBorder p-3 rounded-lg ">
          <Mini
            data={churnRate}
            name={"이탈율"}
            colors={["#FEBA00"]}
            categories={categories}
          />
        </div>
        <div className="shadow-sm border border-mainBorder p-3 rounded-lg ">
          <Mini
            data={dau}
            name={"DAU"}
            colors={["#774F2D"]}
            categories={categories}
          />
        </div>
        <div className="shadow-sm border border-mainBorder p-3 rounded-lg ">
          <Mini
            data={mau}
            name={"MAU"}
            colors={["#FE8825"]}
            categories={categories}
          />
        </div>
        <div className="shadow-sm border border-mainBorder p-3 rounded-lg ">
          <Mini
            data={ancrageRate}
            name={"고착도"}
            colors={["#1474D0"]}
            categories={categories}
          />
        </div>
      </div>
    </>
  );
}
