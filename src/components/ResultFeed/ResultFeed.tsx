import { IResult } from "b3runtime/reduxStore/store.types";
import { spacing } from "b3runtime/styles/spacing";
import * as dateFns from "date-fns";
import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";

import Box from "../Box/Box";
import ContentText from "../ContentText/ContentText";
import Icon from "../Icon/Icon";
import Separator from "../Separator/Separator";

interface Props {
  feed: IResult[];
}

const ResultData = styled.View`
  margin-right: ${spacing.xlg};
  margin-bottom: ${spacing.xs};
  text-align: center;
`;

const ResultFeed: React.FC<Props> = (props) => (
  <Box>
    {props.feed
      .slice()
      .sort((a, b) =>
        dateFns.compareDesc(
          dateFns.parseISO(a.startTime),
          dateFns.parseISO(b.startTime)
        )
      )
      .map((result, i) => (
        <Box key={i}>
          {i > 0 && <Separator color="panel" size="lg" />}
          <Box>
            <View
              style={{
                width: "100%",
                height: 200,
                zIndex: 1,
                position: "absolute",
              }}
            />
            {/* TODO: This map should be replaced with a screenshot image saved to the database instead */}
            {/* <Map
              checkpointList={result.visitedCheckpoints}
              userLocationList={result.userLocations}
              width="100%"
              height="200px"
              centerType="Track"
              centerTypeActive={true}
              drawMapContents={true}
              mapSettings={{
                type: "standard",
                style: "default",
                drawCheckpointLines: true,
                drawUserPath: true,
              }}
              mapContentShade="bright"
              asSummary={true}
              disableTouch={true}
            /> */}
          </Box>
          <Box padding="sm">
            {result.startTime && (
              <Box flexDirection="row" alignItems="center" marginbottom="xs">
                <Icon
                  icon="calendar"
                  size="xxs"
                  marginright="xxs"
                  color="primary"
                />
                <ContentText type="fineprint" color="primary">
                  {dateFns.format(
                    dateFns.parseISO(result.startTime),
                    "LLLL dd, yyyy"
                  )}{" "}
                  at{" "}
                  {dateFns.format(dateFns.parseISO(result.startTime), "kk:mm")}
                </ContentText>
              </Box>
            )}

            <ContentText type="h3">
              {result.track.name || "Unnamed Track"}
            </ContentText>
            {result.competition.name && (
              <ContentText type="fineprint">
                {result.competition.name}
              </ContentText>
            )}

            <Box flexDirection="row" flexWrap={true} margintop="sm">
              <ResultData>
                <ContentText
                  type="fineprint"
                  color="disabled"
                  colorShade="darker"
                >
                  Score
                </ContentText>
                {result.questionAnswers && (
                  <ContentText type="body">
                    {`${
                      result.questionAnswers.filter(
                        (q) => q.state === "CORRECT"
                      ).length
                    } / ${result.questionAnswers.length}`}
                  </ContentText>
                )}
              </ResultData>

              <ResultData>
                <ContentText
                  type="fineprint"
                  color="disabled"
                  colorShade="darker"
                >
                  Total Time
                </ContentText>
                <ContentText type="body">{result.totalTime}</ContentText>
              </ResultData>

              <ResultData>
                <ContentText
                  type="fineprint"
                  color="disabled"
                  colorShade="darker"
                >
                  Distance
                </ContentText>
                <ContentText type="body">{result.totalDistance}</ContentText>
              </ResultData>

              <ResultData>
                <ContentText
                  type="fineprint"
                  color="disabled"
                  colorShade="darker"
                >
                  Avg Pace
                </ContentText>
                <ContentText type="body">{result.averagePace}</ContentText>
              </ResultData>

              <ResultData>
                <ContentText
                  type="fineprint"
                  color="disabled"
                  colorShade="darker"
                >
                  Avg Time To Answer
                </ContentText>
                <ContentText type="body">
                  {result.averageTimeToAnswer}
                </ContentText>
              </ResultData>
            </Box>
          </Box>
        </Box>
      ))}
  </Box>
);
export default ResultFeed;
