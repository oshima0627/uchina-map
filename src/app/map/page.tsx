import { MapView } from "./map-view";

export const metadata = {
  title: "マップで探す",
  description: "沖縄南部の子連れスポットを地図上で確認できます。",
};

export default function MapPage() {
  return (
    <div className="h-[calc(100dvh-9rem)] md:h-[calc(100dvh-3.5rem)] min-h-[60vh] relative bg-sand-light">
      <MapView />
    </div>
  );
}
