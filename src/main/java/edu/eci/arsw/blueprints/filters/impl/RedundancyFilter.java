package edu.eci.arsw.blueprints.filters.impl;

import edu.eci.arsw.blueprints.filters.BlueprintsFilter;
import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RedundancyFilter implements BlueprintsFilter {
    @Override
    public Blueprint blueprintsFilter(Blueprint bp) {
        List<Point> points = new ArrayList<>();
        if(bp.getPoints() != null && !bp.getPoints().isEmpty()){
            for(int x = 0; x < bp.getPoints().size() - 1; x++){
                if(bp.getPoints().get(x).getX() != bp.getPoints().get(x + 1).getX() ||
                        bp.getPoints().get(x).getY() != bp.getPoints().get(x + 1).getY()){
                    points.add(bp.getPoints().get(x));
                }
            }
            points.add(bp.getPoints().get((bp.getPoints().size()) - 1));
            bp.setPoints(points);
        }
        return bp;
    }

}
