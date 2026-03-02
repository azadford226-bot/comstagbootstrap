package com.hivecontrolsolutions.comestag.base.stereotype;

import org.springframework.core.annotation.AliasFor;
import org.springframework.stereotype.Component;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Adapter {
    @SuppressWarnings("unused")
    @AliasFor(annotation = Component.class)
    String value() default "";
}
