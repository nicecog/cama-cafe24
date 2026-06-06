import BarChart from "./chart/BarChart";
import LineChart from "./chart/LineChart";
import { useTranslation } from "react-i18next";

export default function ChartArea(props: { data: any }) {
  const { categories, churnRate, dau, mau, ancrageRate } = props.data;
  const { t } = useTranslation();

  return (
    <>
      <div className="grid gap-4 mt-2 sm:grid-cols-1 lg:grid-cols-2">
        <div>
          <h1 className="p-2 mb-2 text-md bg-main  text-white  rounded-md">
            {t("monthlyMonitoring.charts.churnRate")}
          </h1>
          <div className="w-full border border-mainBorder rounded-lg shadow-lg ">
            <LineChart
              categories={categories}
              data={churnRate}
              color="#FEBA00"
              name={t("monthlyMonitoring.charts.churnRate")}
            />
          </div>
        </div>

        <div>
          <h1 className="p-2 mb-2 text-md bg-main  text-white  rounded-md">
            {t("monthlyMonitoring.charts.anchorageRate")}
          </h1>
          <div className="w-full border border-mainBorder rounded-lg shadow-lg ">
            <LineChart
              categories={categories}
              data={ancrageRate}
              color="#304758"
              name={t("monthlyMonitoring.charts.anchorageRate")}
            />
          </div>
        </div>

        <div>
          <h1 className="p-2 mb-2 text-md bg-main  text-white  rounded-md">
            {t("monthlyMonitoring.charts.dau")}
          </h1>
          <div className="w-full border border-mainBorder rounded-lg shadow-lg ">
            <BarChart
              categories={categories}
              data={dau}
              name={t("monthlyMonitoring.charts.dau")}
              color="#FE8825"
            />
          </div>
        </div>

        <div>
          <h1 className="p-2 mb-2 text-md bg-main  text-white  rounded-md">
            {t("monthlyMonitoring.charts.mau")}
          </h1>
          <div className="w-full border border-mainBorder rounded-lg shadow-lg ">
            <BarChart
              categories={categories}
              data={mau}
              name={t("monthlyMonitoring.charts.mau")}
              color="#774F2D"
            />
          </div>
        </div>
      </div>
    </>
  );
}
