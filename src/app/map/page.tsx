import { MapView } from "./map-view";

export const metadata = {
  title: "マップで探す",
  description: "沖縄南部の子連れスポットを地図上で確認できます。",
};

export default function MapPage() {
  return (
    <div className="h-[calc(100vh-7.5rem)] md:h-[calc(100vh-3.5rem)] relative">
      <MapView />
    </div>
  );
}
