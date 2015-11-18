package edu.sjsu.cs218.deltasADT;

import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

@Entity
public class DeltaRepository {

    static {
        ObjectifyService.register(DeltaRepository.class);
    }

    @Id private final String name;

    private DeltaRepository(String name) {
        this.name = name;
    }

    @SuppressWarnings("unused")
    public String getName() {
        return name;
    }
}
