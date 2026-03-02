package com.hivecontrolsolutions.comestag.base.stereotype;

import org.springframework.core.annotation.AliasFor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;

import java.lang.annotation.*;

/**
 * Indicates that the annotated class is a Processor component within the system.
 * <p>
 * This annotation serves as a specialization of {@code @RestController}, allowing
 * the annotated class to be detected and registered automatically in the Spring
 * application context during component scanning. It is designed to semantically
 * distinguish Processor components, which generally act as REST API entry points
 * or controllers associated with processing specific operations or tasks.
 * <p>
 * The annotation can be applied at the type level and supports an optional {@code value}
 * attribute to specify a custom component name.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@RestController
public @interface Processor {

    @SuppressWarnings("unused")
    @AliasFor(annotation = Controller.class)
    String value() default "";
}
