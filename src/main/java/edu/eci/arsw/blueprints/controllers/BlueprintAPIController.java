/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.blueprints.controllers;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.persistence.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.services.BlueprintsServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author hcadavid
 */
@RestController
@RequestMapping(value = "/blueprints")
public class BlueprintAPIController {
    @Autowired
    BlueprintsServices bps;
    // La solicitud se realizaría: http://localhost:8080/blueprints?pageNumber=2
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<?> getAllBlueprints(@RequestParam(name = "pageNumber", required = false, defaultValue = "1") int pageNumber) {
        try {
            Set<Blueprint> data = bps.getAllBlueprints(pageNumber);
            return new ResponseEntity<>(data, HttpStatus.ACCEPTED);
        } catch (BlueprintNotFoundException ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("<strong>Error 404:</strong> No se han podido obtener los planos", HttpStatus.NOT_FOUND);
        }
    }

    @RequestMapping(method = RequestMethod.GET, path = "{authorName}")
    public ResponseEntity<?> getBlueprintsByAuthor(@PathVariable String authorName) {
        try {
            Set<Blueprint> data = bps.getBlueprintsByAuthor(authorName);
            return new ResponseEntity<>(data, HttpStatus.ACCEPTED);
        } catch (BlueprintNotFoundException ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("<strong>Error 404:</strong> No se han encontrado Blueprints para el autor <strong>" + authorName + "</strong>", HttpStatus.NOT_FOUND);
        }
    }

    @RequestMapping(method = RequestMethod.GET, path = "{authorName}/{bpName}")
    public ResponseEntity<?> getBlueprint(@PathVariable String authorName, @PathVariable String bpName) {
        try {
            Blueprint data = bps.getBlueprint(authorName, bpName);
            return new ResponseEntity<>(data, HttpStatus.ACCEPTED);
        } catch (BlueprintNotFoundException ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("<strong>Error 404:</strong> No se ha encontrado un Blueprint <strong>" + bpName + "</strong> para el autor <strong>" + authorName+ "</strong>", HttpStatus.NOT_FOUND);
        }
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<?> addNewBlueprint(@RequestBody Blueprint newBp){
        try {
            bps.addNewBlueprint(newBp);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("<strong>Error 403:</strong> Se ha presentado un error al realizar el registro", HttpStatus.FORBIDDEN);
        }
    }

    @RequestMapping(method = RequestMethod.PUT, path = "{authorName}/{bpName}")
    public ResponseEntity<?> setBlueprint(@PathVariable String authorName, @PathVariable String bpName, @RequestBody Blueprint setNBp) {
        try {
            bps.setBlueprint(authorName, bpName, setNBp);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (BlueprintNotFoundException ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("<strong>Error 404:</strong> No se ha encontrado un Blueprint <strong>" + bpName + "</strong> para el autor <strong>" + authorName+ "</strong>", HttpStatus.NOT_FOUND);
        }
    }



}

