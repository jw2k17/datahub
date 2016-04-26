/**
 * Copyright 2015 LinkedIn Corp. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 */
package metadata.etl.scheduler.appworx;

import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;


public class AppworxExecEtlTest{
  AppworxExecEtl aw;

  @BeforeTest
  public void setUp()
      throws Exception {
    aw = new AppworxExecEtl(3, 0L);
  }


  @Test(groups = {"needConfig"})
  public void testExtract() throws Exception {
    aw.extract();
  }

  @Test(groups = {"needConfig"})
  public void testTransform() throws Exception {
    aw.transform();
  }


  @Test(groups = {"needConfig"})
  public void testLoad() throws Exception {
    aw.load();
  }


  @Test(groups = {"needConfig"})
  public void testRun() throws Exception {
    aw.run();
  }

}
