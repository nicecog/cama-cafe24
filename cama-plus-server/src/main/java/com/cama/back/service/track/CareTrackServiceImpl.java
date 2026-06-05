package com.cama.back.service.track;

import com.cama.back.AppContext;
import com.cama.back.controller.track.TrackRestController;
import com.cama.back.dto.track.DiseaseOption;
import com.cama.back.dto.track.DiseaseTreatment;
import com.cama.back.dto.track.TrackDataRsp;
import com.cama.back.dto.track.TrackResponse;
import com.cama.back.dto.doctor.ContentsRsp;
import com.cama.back.exception.TrackResponseException;
import com.cama.back.mapper.CareTrackMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.cama.back.mapper.CareTrackMapper;
import com.cama.back.mapper.ContentsMapper;

import lombok.extern.slf4j.Slf4j;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
public class CareTrackServiceImpl implements CareTrackService {

    private final RestTemplate restTemplate;
    private final CareTrackMapper careTrackMapper;
    private final ContentsMapper contentsMapper;

    public CareTrackServiceImpl(RestTemplate restTemplate,
    		CareTrackMapper careTrackMapper, ContentsMapper contentsMapper) {
        this.restTemplate = restTemplate;
        this.careTrackMapper = careTrackMapper;
        this.contentsMapper = contentsMapper;
    }

    @Value("${spring.profiles.active}")
    private String activeProfile;

    /* 2025.05.26 파이썬 접속 안되어 삭제 
    @Override
    public TrackResponse callTrackService(Long hospitalSeq, Long acSeq, Long diseaseSeq, Long days, List<String> interest,
                                          List<DiseaseOption> diseaseOption, List<DiseaseTreatment> diseaseTreatment) {
        String SERVICE_URL = "http://3.35.141.222:5000/GenerateTrack";

        Map<String, Object> params = new HashMap<>();
        params.put("hospital", hospitalSeq);
        params.put("user", acSeq);
        params.put("disease", diseaseSeq);
        params.put("days", days);
        params.put("interest", interest);
        params.put("diseaseOption", diseaseOption);
        params.put("diseaseTreatment", diseaseTreatment);
        params.put("env", activeProfile.equals("local") ? "dev" : "prd");

        String body = AppContext.GSON.toJson(params);

        //System.out.println(body);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        HttpEntity<String> entity = new HttpEntity<>(body, headers);
        ResponseEntity response = restTemplate.postForEntity(SERVICE_URL, entity, String.class);

        if (response.getBody() != null) {
            return AppContext.GSON.fromJson(response.getBody().toString(), TrackResponse.class);
        } else {
            throw new TrackResponseException();
        }

    }
    */
    
    /*
    // 순차적으로 할당 
    @Override
    public TrackResponse callTrackService(Long hospitalSeq, Long acSeq, Long diseaseSeq, Long days, List<String> interest,
                                          List<DiseaseOption> diseaseOption, List<DiseaseTreatment> diseaseTreatment) {        

    	TrackResponse trackResponse = new TrackResponse();
    	List<ContentsRsp> contentsInterDatas = new ArrayList<ContentsRsp>();
        Map<String, Object> params = new HashMap<>();
        params.put("hospital", hospitalSeq);
        params.put("user", acSeq);
        params.put("disease", diseaseSeq);
        params.put("days", days);
        params.put("interest", interest);
        params.put("diseaseOption", diseaseOption);
        params.put("diseaseTreatment", diseaseTreatment);
        params.put("env", activeProfile.equals("local") ? "dev" : "prd");
        
        ArrayList<String> interestStr = new ArrayList<String>();
        String strInterest = "";
        for(int i=0; i < interest.size(); i++ ) {
        	strInterest = "\'\"" + interest.get(i) + "\"\'";
        	interestStr.add(strInterest);
        }

        //System.out.println(params);
        //System.out.println("strInterest => " + interestStr);

        // 질환:유방암 , 치료시기:암진단으로 content 목록조회
        List<ContentsRsp> contentsDatas = contentsMapper.getCareTrackContentsList(diseaseSeq, diseaseTreatment.get(0).getSeq());
        
        if (!contentsDatas.isEmpty()) {
        	Map<String, List<Long>> track = new HashMap<>();
        	ArrayList<Long> tracks = new ArrayList<Long>();
        	long contentLength = contentsDatas.size();
        	long dayAvgCnt = (long)Math.round(contentLength/days);
        	long dayNum = 0;
        	long dayCnt = 0;
        	long recurNum = 1;
        	long contentCnt = 0;
        	List<Long> trackSeqList = new ArrayList<>();
        	trackResponse.setCode("200");
        	trackResponse.setMessage("success");
        	
        	//contents목록을 Random 하게 
        	for(ContentsRsp contentsRsp : contentsDatas) {
        		trackSeqList.add(contentsRsp.getSeq());
        	}
        	long[] randomList = randomGetList(trackSeqList);
        	
            if(contentLength > days) {
        		for(int i=0; i< randomList.length; i++) {
         	       if (dayNum == days) {
              	      if (contentCnt == contentLength) {
              	          break;
            	      } else {
            	       	  //남는거는 처음부터 할당 추가 
            	       	  if (track != null) {
            	       		  List<Long> asisTrack = track.get(String.valueOf(recurNum));
            	       		  asisTrack.add(randomList[i]);
                        	  track.put(Long.toString(recurNum), asisTrack); 
               	        	  recurNum++;
                    	  }             	       		
              	       }
              	    } else {
              	       if (dayCnt < dayAvgCnt) {
              	      	  tracks.add(randomList[i]);
                          dayCnt++;
              	       }
                       if (dayCnt == dayAvgCnt) {
                     	  dayCnt = 0;
                     	  dayNum++;
                	      track.put(Long.toString(dayNum), tracks); 
                          tracks = new ArrayList<Long>(); 
                       }             	        
                    } 
         	    	contentCnt++;
         	    }
        	 } else { //contentLength <= days
        	    int lackCnt = days.intValue() - contentsDatas.size();
        		  
        		for(int i=0; i< randomList.length; i++) {
        		   if (dayNum <= contentsDatas.size()) {
        			  tracks.add(randomList[i]); 
        			  dayNum++;
        			  track.put(Long.toString(dayNum), tracks); 
        			  tracks = new ArrayList<Long>(); 
        		   }
        		}

        	 	//부족한 Contest는 관심분야로  추가 해준다.
        		if (lackCnt > 0) {
            	    //관심분야를 추가 해준다.
            		contentsInterDatas = contentsMapper.getCareTrackContentsInterList(diseaseSeq, diseaseTreatment.get(0).getSeq(),interestStr);
            		trackSeqList = new ArrayList<>();
            		for(ContentsRsp contentsInterRsp : contentsInterDatas) {
                  	    trackSeqList.add(contentsInterRsp.getSeq());
                    }
                  	long[] randomInterList = randomGetList(trackSeqList);
                  	
                  	for(int i=0; i< randomInterList.length; i++) {
        				if (lackCnt > 0) {
        					tracks.add(randomInterList[i]); 
        					dayNum++;
              			    track.put(Long.toString(dayNum), tracks); 
              			    tracks = new ArrayList<Long>(); 
              			    lackCnt--;
        				} else {
        					break;
        				}
        			}
                  	
                  	//부족분 반복해서 
                  	if (lackCnt > 0) {
                  	    for(int i=0; i < lackCnt; i++) {
                  	    	Double d = Math.random() * randomInterList.length + 1;
                  	    	tracks.add(randomInterList[d.intValue()-1]); 
        					dayNum++;
              			    track.put(Long.toString(dayNum), tracks); 
              			    tracks = new ArrayList<Long>(); 
                  	    }
                  	}
        		}
         	 }   
        	   
           	 if (track != null) {
                trackResponse.setTrack(track);
             }
        }
        
        return trackResponse;
    }
    */
    
    // 우선순위 기준으로 할당 
    @Override
    public TrackResponse callTrackService(Long hospitalSeq, Long acSeq, Long diseaseSeq, Long days, List<String> interest,
                                          List<DiseaseOption> diseaseOption, List<DiseaseTreatment> diseaseTreatment) {        

    	TrackResponse trackResponse = new TrackResponse();
    	List<ContentsRsp> contentsDatas1 = new ArrayList<ContentsRsp>();
    	List<ContentsRsp> contentsDatas2 = new ArrayList<ContentsRsp>();
    	List<ContentsRsp> contentsDatas3 = new ArrayList<ContentsRsp>();
    	List<ContentsRsp> contentsDatas4 = new ArrayList<ContentsRsp>();
    	List<ContentsRsp> contentsDatas5 = new ArrayList<ContentsRsp>();

        
        ArrayList<String> interestStr = new ArrayList<String>();
        String strInterest = "";
        for(int i=0; i < interest.size(); i++ ) {
        	strInterest = "\'\"" + interest.get(i) + "\"\'";
        	interestStr.add(strInterest);
        }

        //log.info("strInterest => " + interestStr);
        //log.info("diseaseSeq => " + diseaseSeq);
        //log.info("diseaseTreatment.get(0).getSeq() => " + diseaseTreatment.get(0).getSeq());

        if (diseaseTreatment == null || diseaseTreatment.isEmpty()) {
            log.warn("Care track request missing diseaseTreatment (acSeq={}, diseaseSeq={})", acSeq, diseaseSeq);
            throw new TrackResponseException();
        }

        // 질환:유방암 , 치료시기:암진단으로 content 목록조회
        List<ContentsRsp> contentsDatas = contentsMapper.getCareTrackContentsList(diseaseSeq, diseaseTreatment.get(0).getSeq());
        if (contentsDatas.isEmpty()) {
            log.warn("No care track contents for diseaseSeq={}, treatmentSeq={} (profile={})",
                    diseaseSeq, diseaseTreatment.get(0).getSeq(), activeProfile);
            if (activeProfile != null && activeProfile.contains("local")) {
                List<ContentsRsp> generalContents = contentsMapper.getCareTrackGeneralCancerContentsList(diseaseSeq);
                return buildFallbackTrackResponse(days, generalContents);
            }
            throw new TrackResponseException();
        }
        contentsDatas1 = contentsDatas.stream().filter(c -> c.getPriority() == 1).collect(Collectors.toList());
        contentsDatas2 = contentsDatas.stream().filter(c -> c.getPriority() == 2).collect(Collectors.toList());        		
        contentsDatas3 = contentsDatas.stream().filter(c -> c.getPriority() == 3).collect(Collectors.toList()); 
        contentsDatas4 = contentsDatas.stream().filter(c -> c.getPriority() == 4).collect(Collectors.toList()); 
        contentsDatas5 = contentsDatas.stream().filter(c -> c.getPriority() == 5).collect(Collectors.toList()); 
        
        //log.info("contentsDatas.size()  => " + contentsDatas.size());
        //log.info("contentsDatas1.size() => " + contentsDatas1.size());
        //log.info("contentsDatas2.size() => " + contentsDatas2.size());
        //log.info("contentsDatas3.size() => " + contentsDatas3.size());
        //log.info("contentsDatas4.size() => " + contentsDatas4.size());
        //log.info("contentsDatas5.size() => " + contentsDatas5.size());
        
        // 질환:암(general) 으로 content 목록조회
        List<ContentsRsp> contentsDatas6 = contentsMapper.getCareTrackGeneralCancerContentsList(diseaseSeq);
        //log.info("contentsDatas6.size() => " + contentsDatas6.size());
        
        if (!contentsDatas.isEmpty()) {
        	Map<String, List<Long>> track = new HashMap<>();
        	ArrayList<Long> tracks = new ArrayList<Long>();
        	long contentLength = contentsDatas.size();
        	long dayAvgCnt = (long)Math.ceil(contentLength/(double)days);
        	long dayNum = 0;
        	long dayCnt = 0;
        	boolean allocDatas1 = true;
        	boolean allocDatas2 = true;
        	boolean allocDatas3 = true;
        	boolean allocDatas4 = true;
        	boolean allocDatas5 = true;
        	boolean allocDatas6 = true;
        	List<Long> trackSeqList = new ArrayList<>();
        	trackResponse.setCode("200");
        	trackResponse.setMessage("success");
        	
        	//log.info("dayAvgCnt  => " + dayAvgCnt);
        	while (dayNum < days) {
        	   //log.info("dayNum  => " + dayNum);
        	   //log.info("days  => " + days);
        	   // 1순위 할당 
        	   if (contentsDatas1.size() > 0 && allocDatas1) {
        		  //log.info("<<<< contentsDatas1 >>>>> ");
        		  trackSeqList = new ArrayList<>();
        	      for(ContentsRsp contentsRsp1 : contentsDatas1) {
        	    	  trackSeqList.add(contentsRsp1.getSeq());
                  }
               	  long[] randomList = randomGetList(trackSeqList);
               	  
               	  for(int i=0; i< randomList.length; i++) {
               		 if (dayNum == days) {
               		    break;
               		 }
                	 if (dayCnt < dayAvgCnt) {
                	   	tracks.add(randomList[i]);
                        dayCnt++;
                	 }
                     if (dayCnt == dayAvgCnt) {
                       	dayCnt = 0;
                       	dayNum++;
                  	    track.put(Long.toString(dayNum), tracks); 
                        tracks = new ArrayList<Long>(); 
                     }             	                            
                  }
               	  
                  if (dayNum == days && dayCnt == dayAvgCnt) {
                	 allocDatas2 = false;  
                  }
                  //log.info("allocDatas2  => " + allocDatas2);
        	   } 
        	
        	   // 2순위 할당 
        	   if (contentsDatas2.size() > 0 && allocDatas2) {
        		  //log.info("<<<< contentsDatas2 >>>>> ");
        		  trackSeqList = new ArrayList<>();
         	      for(ContentsRsp contentsRsp2 : contentsDatas2) {
                	 trackSeqList.add(contentsRsp2.getSeq());
                  }
                  long[] randomList = randomGetList(trackSeqList);
                	  
                  for(int i=0; i< randomList.length; i++) {
                	 if (dayNum == days) {
                        break;
                     }
                 	 if (dayCnt < dayAvgCnt) {
                 	   	tracks.add(randomList[i]);
                        dayCnt++;
                 	 }
                     if (dayCnt == dayAvgCnt) {
                        dayCnt = 0;
                        dayNum++;
                   	    track.put(Long.toString(dayNum), tracks); 
                        tracks = new ArrayList<Long>(); 
                     }             	                            
                  }
                	  
                  if (dayNum == days && dayCnt == dayAvgCnt) {
                 	 allocDatas3 = false;  
                  }
                   
                  //log.info("allocDatas3  => " + allocDatas3);        		
        	   }
        	
        	   // 3순위 할당 
        	   if (contentsDatas3.size() > 0 && allocDatas3) {
         		  //log.info("<<<< contentsDatas3 >>>>> ");
         		  trackSeqList = new ArrayList<>();
          	      for(ContentsRsp contentsRsp3 : contentsDatas3) {
                 	 trackSeqList.add(contentsRsp3.getSeq());
                  }
                  long[] randomList = randomGetList(trackSeqList);
                 	  
                  for(int i=0; i< randomList.length; i++) {
                 	 if (dayNum == days) {
                        break;
                     }
                  	 if (dayCnt < dayAvgCnt) {
                  	   	tracks.add(randomList[i]);
                        dayCnt++;
                  	 }
                     if (dayCnt == dayAvgCnt) {
                        dayCnt = 0;
                        dayNum++;
                    	track.put(Long.toString(dayNum), tracks); 
                        tracks = new ArrayList<Long>(); 
                     }             	                            
                  }
                 	  
                  if (dayNum == days && dayCnt == dayAvgCnt) {
                  	  allocDatas4 = false;  
                  }
                    
                  //log.info("allocDatas4  => " + allocDatas4);       		
        	   } 

        	   // 4순위 할당 
        	   if (contentsDatas4.size() > 0 && allocDatas4) {
          		  //log.info("<<<< contentsDatas4 >>>>> ");
          		  trackSeqList = new ArrayList<>();
           	      for(ContentsRsp contentsRsp4 : contentsDatas4) {
                  	 trackSeqList.add(contentsRsp4.getSeq());
                  }
                  long[] randomList = randomGetList(trackSeqList);
                  	  
                  for(int i=0; i< randomList.length; i++) {
                  	 if (dayNum == days) {
                        break;
                     }
                   	 if (dayCnt < dayAvgCnt) {
                   	   	tracks.add(randomList[i]);
                        dayCnt++;
                   	 }
                     if (dayCnt == dayAvgCnt) {
                        dayCnt = 0;
                        dayNum++;
                     	track.put(Long.toString(dayNum), tracks); 
                        tracks = new ArrayList<Long>(); 
                     }             	                            
                  }
                  	  
                  if (dayNum == days && dayCnt == dayAvgCnt) {
                   	 allocDatas5 = false;  
                  }
                     
                  //log.info("allocDatas5  => " + allocDatas5);       		       		
        	   } 


        	   // 5순위 할당 
        	   if (contentsDatas5.size() > 0 && allocDatas5) {
          		  //log.info("<<<< contentsDatas5 >>>>> ");
          		  trackSeqList = new ArrayList<>();
           	      for(ContentsRsp contentsRsp5 : contentsDatas5) {
                  	 trackSeqList.add(contentsRsp5.getSeq());
                  }
                  long[] randomList = randomGetList(trackSeqList);
                  	  
                  for(int i=0; i< randomList.length; i++) {
                  	 if (dayNum == days) {
                        break;
                     }
                   	 if (dayCnt < dayAvgCnt) {
                   	   	tracks.add(randomList[i]);
                        dayCnt++;
                   	 }
                     if (dayCnt == dayAvgCnt) {
                        dayCnt = 0;
                        dayNum++;
                     	track.put(Long.toString(dayNum), tracks); 
                        tracks = new ArrayList<Long>(); 
                     }             	                            
                  }
                  	  
                  if (dayNum == days && dayCnt == dayAvgCnt) {
                   	 allocDatas6 = false;  
                  }
                     
                  //log.info("allocDatas6  => " + allocDatas5);       		       		
        	   } 

        	   // 6순위 할당 
        	   if (contentsDatas6.size() > 0 && allocDatas6) {
           		  //log.info("<<<< contentsDatas6 >>>>> ");
           		  trackSeqList = new ArrayList<>();
            	  for(ContentsRsp contentsRsp6 : contentsDatas6) {
                   	 trackSeqList.add(contentsRsp6.getSeq());
                  }
                  long[] randomList = priorityGetList(trackSeqList);
                   	  
                  for(int i=0; i< randomList.length; i++) {
                  	 if (dayNum == days) {
                        break;
                     }
                     if (dayCnt < dayAvgCnt) {
                    	tracks.add(randomList[i]);
                        dayCnt++;
                     }
                     if (dayCnt == dayAvgCnt) {
                        dayCnt = 0;
                        dayNum++;
                      	track.put(Long.toString(dayNum), tracks); 
                        tracks = new ArrayList<Long>(); 
                     }             	                            
                  }
                   	  
                  if (dayNum == days && dayCnt == dayAvgCnt) {
                     allocDatas1 = false;  
                  }
                      
                  //log.info("allocDatas1  => " + allocDatas1);       		       		
        	   } 
        	   
        	   if (track != null) {
                  trackResponse.setTrack(track);
               }
        	   allocDatas1 = true;
        	   allocDatas2 = true;
        	   allocDatas3 = true;
        	   allocDatas4 = true;
        	   allocDatas5 = true;
        	   allocDatas6 = true;
        	}
        }
        
        return trackResponse;
    }

    /** 로컬 개발: cm_contents 시드 없을 때 빈/일반 암 트랙으로 가이드 신청만 통과 */
    private TrackResponse buildFallbackTrackResponse(long days, List<ContentsRsp> generalContents) {
        TrackResponse trackResponse = new TrackResponse();
        trackResponse.setCode("200");
        trackResponse.setMessage("success (local fallback)");
        Map<String, List<Long>> track = new HashMap<>();
        long dayNum = 0;
        long dayCnt = 0;
        long dayAvgCnt = generalContents.isEmpty()
                ? 1
                : (long) Math.ceil(generalContents.size() / (double) days);
        List<Long> tracks = new ArrayList<>();
        for (ContentsRsp content : generalContents) {
            if (dayNum >= days) {
                break;
            }
            tracks.add(content.getSeq());
            dayCnt++;
            if (dayCnt >= dayAvgCnt) {
                dayNum++;
                track.put(Long.toString(dayNum), new ArrayList<>(tracks));
                tracks = new ArrayList<>();
                dayCnt = 0;
            }
        }
        if (!tracks.isEmpty() && dayNum < days) {
            dayNum++;
            track.put(Long.toString(dayNum), tracks);
        }
        for (long i = 1; i <= days; i++) {
            track.putIfAbsent(Long.toString(i), new ArrayList<>());
        }
        trackResponse.setTrack(track);
        return trackResponse;
    }
    
	private static long[] randomGetList(List<Long> list) {
		long a[] = new long[list.size()];
		Random r = new Random();
		
		for(int i=0; i < list.size(); i++) {
			a[i] = list.get(r.nextInt(list.size()));
			for (int j=0; j < i ; j++) {
				if (a[i] == a[j]) {
					i--;
				}
			}
		}
		return a;
	}
    
	private static long[] priorityGetList(List<Long> list) {
		long a[] = new long[list.size()];
		
		for(int i=0; i < list.size(); i++) {
			a[i] = list.get(i);
		}
		return a;
	}
}
