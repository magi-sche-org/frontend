import { Box, Card } from "@mui/material";
import { mockEventList } from "./data";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { FC } from "react";
export type Event = {
	id: number;
	name: string;
};

export const EventList = () => {
	// TODO: LocalStorageから取得
	const data = mockEventList;
	return (
		<>
			{data.map((event) => {
				return (
					<Box marginBottom={"10px"}>
						<EventCard {...event}></EventCard>
					</Box>
				);
			})}
		</>
	);
};

const EventCard: FC<Event> = ({ id, name }) => {
	return (
		<Card>
			<CardContent>
				<Typography sx={{ fontSize: 14, textAlign: "center" }}>
					{name}
				</Typography>
			</CardContent>
		</Card>
	);
};
