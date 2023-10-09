/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.blueprints.persistence.impl;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import edu.eci.arsw.blueprints.persistence.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.persistence.BlueprintPersistenceException;
import edu.eci.arsw.blueprints.persistence.BlueprintsPersistence;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 *
 * @author hcadavid
 */
@Service
public class InMemoryBlueprintPersistence implements BlueprintsPersistence{
    //¡Mapeo de persistencia, se utiliza una estructura de datos concurrente!!!!!
    private final Map<Tuple<String, String>, Blueprint> blueprints = new ConcurrentHashMap<>();

    public InMemoryBlueprintPersistence() {
        //load stub data
        Point[] pts0=new Point[]{new Point(140, 140),new Point(115, 115)};
        Blueprint bp0=new Blueprint("Sebas", "Blueprint 1",pts0);
        Point[] pts1=new Point[]{new Point(125, 125),new Point(110, 110),new Point(0, 0)};
        Blueprint bp1=new Blueprint("Sebas", "Blueprint 2",pts1);
        Point[] pts2=new Point[]{new Point(60, 10),new Point(135, 150),new Point(235, 250),new Point(60, 10)};
        Blueprint bp2=new Blueprint("Andres", "Blueprint 3",pts2);
        Point[] pts3 = new Point[]{
                new Point(339, 160),
                new Point(339, 323),
                new Point(99, 323),
                new Point(99, 160),
                new Point(339, 160),
                new Point(213, 83),
                new Point(99, 160)
        };

        Blueprint bp3=new Blueprint("Sebas", "Blueprint 4",pts3);

        blueprints.put(new Tuple<>(bp0.getAuthor(),bp0.getName()), bp0);
        blueprints.put(new Tuple<>(bp1.getAuthor(),bp1.getName()), bp1);
        blueprints.put(new Tuple<>(bp2.getAuthor(),bp2.getName()), bp2);
        blueprints.put(new Tuple<>(bp3.getAuthor(),bp3.getName()), bp3);
    }

    /**
     * Utiliza el método putIfAbsent: El método putIfAbsent() es un método proporcionado por la
     * clase ConcurrentHashMap en Java que se utiliza para agregar un elemento al mapa si y solo si
     * la clave especificada no está ya presente en el mapa.
     *
     * Este método es útil en entornos concurrentes porque garantiza que la operación de agregar un
     * elemento al mapa se realice de manera atómica. Esto significa que, si varios hilos intentan agregar
     * el mismo elemento con la misma clave al mismo tiempo, solo uno de ellos tendrá éxito, y los demás
     * obtendrán el valor existente en el mapa.
     * @param bp the new blueprint
     * @throws BlueprintPersistenceException
     */
    @Override
    public void saveBlueprint(Blueprint bp) throws BlueprintPersistenceException {
        Tuple<String, String> key = new Tuple<>(bp.getAuthor(), bp.getName());
        Blueprint existing = blueprints.putIfAbsent(key, bp);
        if (existing != null) {
            throw new BlueprintPersistenceException("The given blueprint already exists: " + bp);
        }
    }

    @Override
    public Blueprint getBlueprint(String author, String bprintname) throws BlueprintNotFoundException {
        return blueprints.get(new Tuple<>(author, bprintname));
    }
    @Override
    public Set<Blueprint> getBlueprintsByAuthor(String author) throws BlueprintNotFoundException {
        Set<Blueprint> bluePrints = new HashSet<>();
        for (Map.Entry<Tuple<String, String>, Blueprint> entry : blueprints.entrySet()) {
            if (author.equals(entry.getKey().getElem1())) {
                bluePrints.add(entry.getValue());
            }
        }
        if (bluePrints.isEmpty()) {
            throw new BlueprintNotFoundException("Blueprints not found for author: " + author);
        }
        return bluePrints;
    }
    @Override
    public Set<Blueprint> getAllBlueprints(int pageNumber) throws BlueprintNotFoundException {
        int pageSize = 10;
        int startIndex = (pageNumber - 1) * pageSize;
        int endIndex = pageNumber * pageSize;

        Set<Blueprint> bluePrints = new HashSet<>();
        List<Blueprint> blueprintList = new ArrayList<>(blueprints.values());

        if (startIndex >= blueprintList.size()) {
            throw new BlueprintNotFoundException("Page not found");
        }

        for (int i = startIndex; i < Math.min(endIndex, blueprintList.size()); i++) {
            bluePrints.add(blueprintList.get(i));
        }

        return bluePrints;
    }


    @Override
    public void setBlueprint(String author, String bpname, Blueprint nbp) throws BlueprintNotFoundException {
        Blueprint bp = getBlueprint(author, bpname);
        bp.setPoints(nbp.getPoints());
    }


}
