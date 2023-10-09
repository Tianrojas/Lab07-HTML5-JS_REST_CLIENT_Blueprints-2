/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.blueprints.services;

import edu.eci.arsw.blueprints.filters.BlueprintsFilter;
import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.persistence.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.persistence.BlueprintPersistenceException;
import edu.eci.arsw.blueprints.persistence.BlueprintsPersistence;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Set;

/**
 *
 * @author hcadavid
 */
@Controller
public class BlueprintsServices {

    @Autowired
    BlueprintsPersistence bpp=null;
    @Autowired
    BlueprintsFilter bpf;
    
    public void addNewBlueprint(Blueprint bp) throws BlueprintPersistenceException {
        bpp.saveBlueprint(bpf.blueprintsFilter(bp));
    }
    
    public Set<Blueprint> getAllBlueprints(int pageNumber) throws BlueprintNotFoundException {
        return bpp.getAllBlueprints(pageNumber);
    }
    
    /**
     * 
     * @param author blueprint's author
     * @param name blueprint's name
     * @return the blueprint of the given name created by the given author
     * @throws BlueprintNotFoundException if there is no such blueprint
     */
    public Blueprint getBlueprint(String author,String name) throws BlueprintNotFoundException{
        return bpp.getBlueprint(author,name);
    }
    
    /**
     * 
     * @param author blueprint's author
     * @return all the blueprints of the given author
     * @throws BlueprintNotFoundException if the given author doesn't exist
     */
    public Set<Blueprint> getBlueprintsByAuthor(String author) throws BlueprintNotFoundException{
        return bpp.getBlueprintsByAuthor(author);
    }

    /**
     *
     * @param author blueprint's author
     * @param name blueprint's name
     * @param points New set of blueprint´s points
     * @throws BlueprintNotFoundException
     */
    public void setBlueprint(String author, String name, Blueprint bp) throws BlueprintNotFoundException {
        bpp.setBlueprint(author, name, bp);
    }

    
}
