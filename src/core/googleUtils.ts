
export function GoogleResponseToDirectionsResult(data: any): google.maps.DirectionsResult {

    /*
{
  "routes": [
    {
      "legs": [
        {
          "distanceMeters": 33571,
          "duration": "2266s",
          "staticDuration": "2814s",
          "polyline": {
            "encodedPolyline": "k`bjH}duNAg@?mAGWGKGgACqD@]HaD?]?C?y@@E?EBi@BUD_A@eA@}@?kA?y@CwAAs@EeA?ECYCa@G}@?EEc@Ee@AEIq@AGAK[uB?CSa@MKOEYCIBMJSh@G^OnBEJ?hAEvC?|@@vBDbBRbDH~@BRHn@Fb@F\\N|ATtCHnAJzB@XHvBDhAB|@?DFxBD|@XzDJnCFlCFbD`@~RP|IN~FFbDAfBQnA_@dAa@j@c@\\y@TSDM@S?_@Dm@B}@HoAF_A@U?q@UmBgAGEoAy@}@kA_@w@W}@ESMsAK}BCm@g@kLASA][eHU}DS_BGg@Ie@YeAMWQSSQu@KmBFO@QBi@H{ALUBaAb@w@z@KLQ^Wr@ETMz@Cx@DdBJ~AZlD`@hFHpD@^JpGJjED|AN~I@b@PjGVnKD~BNpFD~@`@`KRzDLjBDp@TnDDh@z@fMZxE\\lF^`GVjCFt@`@hDtAzKt@zENr@b@hCnA~GBNt@bEt@zDz@fEt@vDLh@`@bBt@tC\\hAd@xAN`@dAnCb@fA@@j@nA`@x@b@z@v@rAt@jAdChDdCpCJH|ClCnBxALP`B`A|B|A^VbD`CrB`BbB~Az@z@b@`@tBtBfCvCxBtCXb@t@`AxAnBbArA~AtB~@jA`@d@x@bAdFlF|DbE|HrJz@bAvAfBdCzCxAbBDFFH`B~AtB~AdBnAbAv@dC|BbBhBf@p@~@lA^h@vAxBr@bATDjApBt@nA`AdBj@`ApAxBhB`DdGhKb@v@JN|@|AR^z@xAlBdDrDnGhCnE`EbHzClFzCjF~@~AxBvDnAtBPZfD|FjCrEtC`Fp@jAn@jAhAjBvBtDtA~BbAfB`EdHzAhCxAfClAtBnAxBpAxBzClFfAjBb@r@l@fA~@`BfAfBfD`GT`@l@bAfCtE`BzCJRhA|Bj@jA\\v@j@lA`AxB@B`LfWnBnEl@tAlApCf@hAn@zAd@bA~@tBvBbF\\v@rAxCz@pB`AvBz@nBVj@h@lAVj@Rf@n@tAp@~At@~AbAzBxAfDx@hBfAfC`@|@|FxMhHdPnAtCnAtC|@rBrAzC~CvHrAnD\\`Ah@`BtB~G`AxD`@~AH\\bA`Fj@xCNt@nAxHNbAJp@x@zFPpAl@~Dd@fDxBrOZxBLz@v@jFn@pEXrB\\~BHl@n@lEL|@zAnKN~@h@vDJx@\\tBHh@l@~D\\~B`@nCbBlLxAbKvAxJNhAv@lFJp@tAxJl@nFb@xE^|EJtAXbF@ZZpIFpCJ`HDnE@bDLzL@`CDdDBbEBvB@ZD|D?p@BxAFvCDfBFvB^lIb@|GBX`@vEPnBVzBp@vFNjAXrBVxAt@hEj@dD|@hFX`B|@dF|@fF~@hFX~A`@`CP~@p@tDVzARhA\\xBNdAJl@x@dGL`Ad@~CJh@Rx@d@xA\\v@NXh@z@`AfAjA|@\\Nv@X`@Fr@Hd@?~@?pBIx@ClCKtAElEOvEOjCK~@Ez@AF?pDMlBGp@AtAGtK]`FOpOi@pI[|GU~EYnMc@hDMl@A~EQz@C\\?tAAH?TAxAGLHz@AD@z@Nf@ZZ`@JRLXJ^PfAB|@?DMfF?P@pALZKxCKhDAr@?`@ApDBtE@hBBpD@p@FlJ@dABxDFdJ@~DHtM@bC@vABtB?v@@^?`A@hCDjE@rCBbDBrD@jDB~BDxGB|D@|ABzDBzD@`DHbL?hBBrD@jA?P@h@B`BFtA?LFt@@TRhBFd@l@dDTfANt@fApFrBbKTjAJh@Px@l@vCh@fCVbA`AnDb@bBJXRx@Nf@n@`CXdAXbA~AvFlDlMbAlCh@nAh@dAjBjDl@hAvAlCTd@BDz@jBAj@Ph@b@jAj@vAj@zAb@~@PXb@k@j@{@JOb@s@FUV_@RYV_@Xc@Zc@^k@X_@~@sAXa@LQHENEJCUo@R[v@kADG^k@DG~@sAj@{@zBcDvAuB^i@LSLSG_A]aGC[Ce@KsDAoB?m@@u@?G?UBg@D{@JgAB[De@@MRiBN{@F]PcA@MNc@f@}AXy@lAiC|@qAd@k@j@o@Z[d@g@z@{@hBkB|B_CxByBXYfEmEP?j@c@BEFQlAe@hAg@r@YtAm@hAg@NIbBq@DC|@a@ZOt@]DChCgA|@]x@c@DAZMJGDAdAc@JGnB{@\\O|@_@XONFP?\\BL?JHMuAOgBAWI_AQuBG{@C_@Ei@Bg@XJf@KFA\\Gf@I~Ba@VCRMj@M^o@Zu@n@uARe@FODKL[`@{@h@kAl@qAVi@l@uAXo@JYb@PZLjAb@`Bl@TH"
          },
          "startLocation": {
            "latLng": {
              "latitude": 49.0037387,
              "longitude": 2.5711934000000003
            }
          },
          "endLocation": {
            "latLng": {
              "latitude": 48.870517400000004,
              "longitude": 2.3299908
            }
          },
          "steps": [
            {
              "distanceMeters": 60,
              "staticDuration": "8s",
              "polyline": {
                "encodedPolyline": "k`bjH}duNAg@?mAGWGK"
              },
              "startLocation": {
                "latLng": {
                  "latitude": 49.0037387,
                  "longitude": 2.5711934000000003
                }
              },
              "endLocation": {
                "latLng": {
                  "latitude": 49.0038346,
                  "longitude": 2.5719626
                }
              },
              "navigationInstruction": {
                "maneuver": "DEPART",
                "instructions": "Prendre la direction est"
              },
              "localizedValues": {
                "distance": {
                  "text": "60 m"
                },
                "staticDuration": {
                  "text": "1 minute"
                }
              },
              "travelMode": "DRIVE"
            },
            {
              "distanceMeters": 215,
              "staticDuration": "64s",
              "polyline": {
                "encodedPolyline": "}`bjHwiuNGgACqD@]HaD?]?C?y@@E?EBi@"
              },
              "startLocation": {
                "latLng": {
                  "latitude": 49.0038346,
                  "longitude": 2.5719626
                }
              },
              "endLocation": {
                "latLng": {
                  "latitude": 49.0037966,
                  "longitude": 2.5748971999999997
                }
              },
              "navigationInstruction": {
                "maneuver": "TURN_LEFT",
                "instructions": "Rester sur la voie de gauche"
              },
              "localizedValues": {
                "distance": {
                  "text": "0,2 km"
                },
                "staticDuration": {
                  "text": "1 minute"
                }
              },
              "travelMode": "DRIVE"
            },
            {
              "distanceMeters": 312,
              "staticDuration": "55s",
              "polyline": {
                "encodedPolyline": "w`bjHc|uNBUD_A@eA@}@?kA?y@CwAAs@EeA?ECYCa@G}@?EEc@Ee@AEIq@AGAK"
              },
              "startLocation": {
                "latLng": {
                  "latitude": 49.0037966,
                  "longitude": 2.5748971999999997
                }
              },
              "endLocation": {
                "latLng": {
                  "latitude": 49.004010799999996,
                  "longitude": 2.579128
                }
              },
              "navigationInstruction": {
                "maneuver": "NAME_CHANGE",
                "instructions": "Continuer sur Terminal 2E"
              },
              "localizedValues": {
                "distance": {
                  "text": "0,3 km"
                },
                "staticDuration": {
                  "text": "1 minute"
                }
              },
              "travelMode": "DRIVE"
            },
            {
              "distanceMeters": 512,
              "staticDuration": "79s",
              "polyline": {
                "encodedPolyline": "abbjHqvvN[uB?CSa@MKOEYCIBMJSh@G^OnBEJ?hAEvC?|@@vBDbBRbDH~@BRHn@Fb@F\\"
              },
              "startLocation": {
                "latLng": {
                  "latitude": 49.004010799999996,
                  "longitude": 2.579128
                }
              },
              "endLocation": {
                "latLng": {
                  "latitude": 49.004587799999996,
                  "longitude": 2.5745996000000004
                }
              },
              "navigationInstruction": {
                "maneuver": "TURN_LEFT",
                "instructions": "Rester sur la voie de gauche"
              },
              "localizedValues": {
                "distance": {
                  "text": "0,5 km"
                },
                "staticDuration": {
                  "text": "1 minute"
                }
              },
              "travelMode": "DRIVE"
            },
            {
              "distanceMeters": 176,
              "staticDuration": "22s",
              "polyline": {
                "encodedPolyline": "uebjHgzuNN|ATtCHnAJzB@X"
              },
              "startLocation": {
                "latLng": {
                  "latitude": 49.004587799999996,
                  "longitude": 2.5745996000000004
                }
              },
              "endLocation": {
                "latLng": {
                  "latitude": 49.004281,
                  "longitude": 2.5722346
                }
              },
              "navigationInstruction": {
                "maneuver": "TURN_RIGHT",
                "instructions": "Rester sur la voie de droite"
              },
              "localizedValues": {
                "distance": {
                  "text": "0,2 km"
                },
                "staticDuration": {
                  "text": "1 minute"
                }
              },
              "travelMode": "DRIVE"
            },
            {
              "distanceMeters": 4757,
              "staticDuration": "297s",
              "polyline": {
                "encodedPolyline": "wcbjHmkuNHvBDhAB|@?DFxBD|@XzDJnCFlCFbD`@~RP|IN~FFbDAfBQnA_@dAa@j@c@\\y@TSDM@S?_@Dm@B}@HoAF_A@U?q@UmBgAGEoAy@}@kA_@w@W}@ESMsAK}BCm@g@kLASA][eHU}DS_BGg@Ie@YeAMWQSSQu@KmBFO@QBi@H{ALUBaAb@w@z@KLQ^Wr@ETMz@Cx@DdBJ~AZlD`@hFHpD@^JpGJjED|AN~I@b@PjGVnKD~BNpFD~@`@`KRzDLjBDp@TnDDh@z@fMZxE\\lF^`GVjCFt@`@hDtAzKt@zENr@"
              },
              "startLocation": {
                "latLng": {
                  "latitude": 49.004281,
                  "longitude": 2.5722346
                }
              },
              "endLocation": {
                "latLng": {
                  "latitude": 49.00857,
                  "longitude": 2.5352457999999998
                }
              },
              "navigationInstruction": {
                "maneuver": "TURN_LEFT",
                "instructions": "Rester sur la voie de gauche"
              },
              "localizedValues": {
                "distance": {
                  "text": "4,8 km"
                },
                "staticDuration": {
                  "text": "5 minutes"
                }
              },
              "travelMode": "DRIVE"
            },
            {
              "distanceMeters": 1809,
              "staticDuration": "83s",
              "polyline": {
                "encodedPolyline": "q~bjHidnNb@hCnA~GBNt@bEt@zDz@fEt@vDLh@`@bBt@tC\\hAd@xAN`@dAnCb@fA@@j@nA`@x@b@z@v@rAt@jAdChDdCpCJH|ClCnBxALP`B`A|B|A^VbD`CrB`BbB~Az@z@b@`@"
              },
              "startLocation": {
                "latLng": {
                  "latitude": 49.00857,
                  "longitude": 2.5352457999999998
                }
              },
              "endLocation": {
                "latLng": {
                  "latitude": 48.9977885,
                  "longitude": 2.5179803000000005
                }
              },
              "localizedValues": {
                "distance": {
                  "text": "1,8 km"
                },
                "staticDuration": {
                  "text": "1 minute"
                }
              },
              "travelMode": "DRIVE"
            },
            {
              "distanceMeters": 1217,
              "staticDuration": "51s",
              "polyline": {
                "encodedPolyline": "e{`jHkxjNtBtBfCvCxBtCXb@t@`AxAnBbArA~AtB~@jA`@d@x@bAdFlF|DbE|HrJz@bAvAfB"
              },
              "startLocation": {
                "latLng": {
                  "latitude": 48.9977885,
                  "longitude": 2.5179803000000005
                }
              },
              "endLocation": {
                "latLng": {
                  "latitude": 48.9890315,
                  "longitude": 2.5079969
                }
              },
              "navigationInstruction": {
                "maneuver": "TURN_LEFT",
                "instructions": "Rester sur la voie de gauche"
              },
              "localizedValues": {
                "distance": {
                  "text": "1,2 km"
                },
                "staticDuration": {
                  "text": "1 minute"
                }
              },
              "travelMode": "DRIVE"
            },
            {
              "distanceMeters": 16221,
              "staticDuration": "770s",
              "polyline": {
                "encodedPolyline": "md_jH_zhNdCzCxAbBDFFH`B~AtB~AdBnAbAv@dC|BbBhBf@p@~@lA^h@vAxBr@bATDjApBt@nA`AdBj@`ApAxBhB`DdGhKb@v@JN|@|AR^z@xAlBdDrDnGhCnE`EbHzClFzCjF~@~AxBvDnAtBPZfD|FjCrEtC`Fp@jAn@jAhAjBvBtDtA~BbAfB`EdHzAhCxAfClAtBnAxBpAxBzClFfAjBb@r@l@fA~@`BfAfBfD`GT`@l@bAfCtE`BzCJRhA|Bj@jA\\v@j@lA`AxB@B`LfWnBnEl@tAlApCf@hAn@zAd@bA~@tBvBbF\\v@rAxCz@pB`AvBz@nBVj@h@lAVj@Rf@n@tAp@~At@~AbAzBxAfDx@hBfAfC`@|@|FxMhHdPnAtCnAtC|@rBrAzC~CvHrAnD\\`Ah@`BtB~G`AxD`@~AH\\bA`Fj@xCNt@nAxHNbAJp@x@zFPpAl@~Dd@fDxBrOZxBLz@v@jFn@pEXrB\\~BHl@n@lEL|@zAnKN~@h@vDJx@\\tBHh@l@~D\\~B`@nCbBlLxAbKvAxJNhAv@lFJp@tAxJl@nFb@xE^|EJtAXbF@ZZpIFpCJ`HDnE@bDLzL@`CDdDBbEBvB@ZD|D?p@BxAFvCDfBFvB^lIb@|GBX`@vEPnBVzBp@vFNjAXrBVxAt@hEj@dD|@hFX`B|@dF|@fF~@hFX~A`@`CP~@p@tDVzARhA\\xBNdAJl@x@dGL`Ad@~CJh@Rx@d@xA\\v@NXh@z@`AfAjA|@\\Nv@X`@Fr@Hd@?~@?pBIx@ClCKtAElEOvEOjCK~@Ez@AF?pDMlBGp@AtAGtK]`FOpOi@pI[|GU~EYnMc@hDMl@A~EQz@C\\?tAAH?TAxAG"
              },
              "startLocation": {
                "latLng": {
                  "latitude": 48.9890315,
                  "longitude": 2.5079969
                }
              },
              "endLocation": {
                "latLng": {
                  "latitude": 48.9024311,
                  "longitude": 2.3586199
                }
              },
              "localizedValues": {
                "distance": {
                  "text": "16,2 km"
                },
                "staticDuration": {
                  "text": "13 minutes"
                }
              },
              "travelMode": "DRIVE"
            },
            {
              "distanceMeters": 347,
              "staticDuration": "47s",
              "polyline": {
                "encodedPolyline": "egniHktkMLHz@AD@z@Nf@ZZ`@JRLXJ^PfAB|@?DMfF?P@pALZ"
              },
              "startLocation": {
                "latLng": {
                  "latitude": 48.9024311,
                  "longitude": 2.3586199
                }
              },
              "endLocation": {
                "latLng": {
                  "latitude": 48.9010849,
                  "longitude": 2.3552907
                }
              },
              "navigationInstruction": {
                "maneuver": "RAMP_RIGHT",
                "instructions": "Prendre la sortie en direction de Rouen/Périphérique O/Pte de Clignacourt"
              },
              "localizedValues": {
                "distance": {
                  "text": "0,3 km"
                },
                "staticDuration": {
                  "text": "1 minute"
                }
              },
              "travelMode": "DRIVE"
            },
            {
              "distanceMeters": 4049,
              "staticDuration": "278s",
              "polyline": {
                "encodedPolyline": "w~miHq_kMKxCKhDAr@?`@ApDBtE@hBBpD@p@FlJ@dABxDFdJ@~DHtM@bC@vABtB?v@@^?`A@hCDjE@rCBbDBrD@jDB~BDxGB|D@|ABzDBzD@`DHbL?hBBrD@jA?P@h@B`BFtA?LFt@@TRhBFd@l@dDTfANt@fApFrBbKTjAJh@Px@l@vCh@fCVbA`AnDb@bBJXRx@Nf@n@`CXdAXbA~AvFlDlMbAlCh@nAh@dAjBjDl@hAvAlCTd@BDz@jB"
              },
              "startLocation": {
                "latLng": {
                  "latitude": 48.9010849,
                  "longitude": 2.3552907
                }
              },
              "endLocation": {
                "latLng": {
                  "latitude": 48.8931888,
                  "longitude": 2.303127
                }
              },
              "navigationInstruction": {
                "maneuver": "MERGE",
                "instructions": "Rejoindre Blvd Périphérique"
              },
              "localizedValues": {
                "distance": {
                  "text": "4,0 km"
                },
                "staticDuration": {
                  "text": "5 minutes"
                }
              },
              "travelMode": "DRIVE"
            },
            {
              "distanceMeters": 150,
              "staticDuration": "33s",
              "polyline": {
                "encodedPolyline": "mmliHqy`MAj@Ph@b@jAj@vAj@zA"
              },
              "startLocation": {
                "latLng": {
                  "latitude": 48.8931888,
                  "longitude": 2.303127
                }
              },
              "endLocation": {
                "latLng": {
                  "latitude": 48.892491899999996,
                  "longitude": 2.3014223
                }
              },
              "navigationInstruction": {
                "maneuver": "RAMP_RIGHT",
                "instructions": "Prendre la sortie D909 en direction de Prte d'Asnières"
              },
              "localizedValues": {
                "distance": {
                  "text": "0,2 km"
                },
                "staticDuration": {
                  "text": "1 minute"
                }
              },
              "travelMode": "DRIVE"
            },
            {
              "distanceMeters": 31,
              "staticDuration": "9s",
              "polyline": {
                "encodedPolyline": "ailiH{n`Mb@~@"
              },
              "startLocation": {
                "latLng": {
                  "latitude": 48.892491899999996,
                  "longitude": 2.3014223
                }
              },
              "endLocation": {
                "latLng": {
                  "latitude": 48.892314299999995,
                  "longitude": 2.3011011999999997
                }
              },
              "navigationInstruction": {
                "maneuver": "MERGE",
                "instructions": "Rejoindre Bd du Fort de Vaux"
              },
              "localizedValues": {
                "distance": {
                  "text": "31 m"
                },
                "staticDuration": {
                  "text": "1 minute"
                }
              },
              "travelMode": "DRIVE"
            },
            {
              "distanceMeters": 328,
              "staticDuration": "106s",
              "polyline": {
                "encodedPolyline": "}gliH{l`MPXb@k@j@{@JOb@s@FUV_@RYV_@Xc@Zc@^k@X_@~@sAXa@LQ"
              },
              "startLocation": {
                "latLng": {
                  "latitude": 48.892314299999995,
                  "longitude": 2.3011011999999997
                }
              },
              "endLocation": {
                "latLng": {
                  "latitude": 48.8901153,
                  "longitude": 2.303807
                }
              },
              "navigationInstruction": {
                "maneuver": "TURN_LEFT",
                "instructions": "Prendre à gauche sur Av. de la Prte d'Asnières"
              },
              "localizedValues": {
                "distance": {
                  "text": "0,3 km"
                },
                "staticDuration": {
                  "text": "2 minutes"
                }
              },
              "travelMode": "DRIVE"
            },
            {
              "distanceMeters": 43,
              "staticDuration": "18s",
              "polyline": {
                "encodedPolyline": "gzkiHy}`MHENEJCUo@"
              },
              "startLocation": {
                "latLng": {
                  "latitude": 48.8901153,
                  "longitude": 2.303807
                }
              },
              "endLocation": {
                "latLng": {
                  "latitude": 48.890042099999995,
                  "longitude": 2.3041291
                }
              },
              "navigationInstruction": {
                "maneuver": "TURN_LEFT",
                "instructions": "Prendre à gauche sur Bd Berthier"
              },
              "localizedValues": {
                "distance": {
                  "text": "43 m"
                },
                "staticDuration": {
                  "text": "1 minute"
                }
              },
              "travelMode": "DRIVE"
            },
            {
              "distanceMeters": 372,
              "staticDuration": "99s",
              "polyline": {
                "encodedPolyline": "wykiHy_aMR[v@kADG^k@DG~@sAj@{@zBcDvAuB^i@LSLS"
              },
              "startLocation": {
                "latLng": {
                  "latitude": 48.890042099999995,
                  "longitude": 2.3041291
                }
              },
              "endLocation": {
                "latLng": {
                  "latitude": 48.887535899999996,
                  "longitude": 2.3074935
                }
              },
              "navigationInstruction": {
                "maneuver": "TURN_RIGHT",
                "instructions": "Prendre à droite sur Rue de Tocqueville"
              },
              "localizedValues": {
                "distance": {
                  "text": "0,4 km"
                },
                "staticDuration": {
                  "text": "2 minutes"
                }
              },
              "travelMode": "DRIVE"
            },
            {
              "distanceMeters": 496,
              "staticDuration": "113s",
              "polyline": {
                "encodedPolyline": "cjkiHytaMG_A]aGC[Ce@KsDAoB?m@@u@?G?UBg@D{@JgAB[De@@MRiBN{@F]PcA"
              },
              "startLocation": {
                "latLng": {
                  "latitude": 48.887535899999996,
                  "longitude": 2.3074935
                }
              },
              "endLocation": {
                "latLng": {
                  "latitude": 48.8873452,
                  "longitude": 2.3141195
                }
              },
              "navigationInstruction": {
                "maneuver": "TURN_LEFT",
                "instructions": "Prendre à gauche sur Bd Pereire"
              },
              "localizedValues": {
                "distance": {
                  "text": "0,5 km"
                },
                "staticDuration": {
                  "text": "2 minutes"
                }
              },
              "travelMode": "DRIVE"
            },
            {
              "distanceMeters": 1570,
              "staticDuration": "352s",
              "polyline": {
                "encodedPolyline": "}hkiHg~bM@MNc@f@}AXy@lAiC|@qAd@k@j@o@Z[d@g@z@{@hBkB|B_CxByBXYfEmEP?j@c@BEFQlAe@hAg@r@YtAm@hAg@NIbBq@DC|@a@ZOt@]DChCgA|@]x@c@DAZMJGDAdAc@JGnB{@\\O|@_@XONFP?\\BL?JH"
              },
              "startLocation": {
                "latLng": {
                  "latitude": 48.8873452,
                  "longitude": 2.3141195
                }
              },
              "endLocation": {
                "latLng": {
                  "latitude": 48.8751813,
                  "longitude": 2.3238178
                }
              },
              "navigationInstruction": {
                "maneuver": "NAME_CHANGE",
                "instructions": "Continuer sur Rue de Rome"
              },
              "localizedValues": {
                "distance": {
                  "text": "1,6 km"
                },
                "staticDuration": {
                  "text": "6 minutes"
                }
              },
              "travelMode": "DRIVE"
            },
            {
              "distanceMeters": 81,
              "staticDuration": "32s",
              "polyline": {
                "encodedPolyline": "{|hiH{zdMMuAOgBAW"
              },
              "startLocation": {
                "latLng": {
                  "latitude": 48.8751813,
                  "longitude": 2.3238178
                }
              },
              "endLocation": {
                "latLng": {
                  "latitude": 48.875340699999995,
                  "longitude": 2.3248911
                }
              },
              "navigationInstruction": {
                "maneuver": "TURN_LEFT",
                "instructions": "Prendre à gauche sur Pl. Gabriel Péri"
              },
              "localizedValues": {
                "distance": {
                  "text": "81 m"
                },
                "staticDuration": {
                  "text": "1 minute"
                }
              },
              "travelMode": "DRIVE"
            },
            {
              "distanceMeters": 133,
              "staticDuration": "51s",
              "polyline": {
                "encodedPolyline": "{}hiHqaeMI_AQuBG{@C_@Ei@Bg@"
              },
              "startLocation": {
                "latLng": {
                  "latitude": 48.875340699999995,
                  "longitude": 2.3248911
                }
              },
              "endLocation": {
                "latLng": {
                  "latitude": 48.8755519,
                  "longitude": 2.3266651
                }
              },
              "navigationInstruction": {
                "maneuver": "NAME_CHANGE",
                "instructions": "Continuer sur Rue Saint-Lazare"
              },
              "localizedValues": {
                "distance": {
                  "text": "0,1 km"
                },
                "staticDuration": {
                  "text": "1 minute"
                }
              },
              "travelMode": "DRIVE"
            },
            {
              "distanceMeters": 168,
              "staticDuration": "71s",
              "polyline": {
                "encodedPolyline": "e_iiHuleMXJf@KFA\\Gf@I~Ba@VC"
              },
              "startLocation": {
                "latLng": {
                  "latitude": 48.8755519,
                  "longitude": 2.3266651
                }
              },
              "endLocation": {
                "latLng": {
                  "latitude": 48.8740688,
                  "longitude": 2.3269575
                }
              },
              "navigationInstruction": {
                "maneuver": "TURN_RIGHT",
                "instructions": "Prendre à droite sur Rue du Havre"
              },
              "localizedValues": {
                "distance": {
                  "text": "0,2 km"
                },
                "staticDuration": {
                  "text": "1 minute"
                }
              },
              "travelMode": "DRIVE"
            },
            {
              "distanceMeters": 37,
              "staticDuration": "18s",
              "polyline": {
                "encodedPolyline": "}uhiHoneMRMj@M"
              },
              "startLocation": {
                "latLng": {
                  "latitude": 48.8740688,
                  "longitude": 2.3269575
                }
              },
              "endLocation": {
                "latLng": {
                  "latitude": 48.8737523,
                  "longitude": 2.3271007
                }
              },
              "navigationInstruction": {
                "maneuver": "TURN_SLIGHT_LEFT",
                "instructions": "Tourner légèrement à gauche pour rester sur Rue du Havre"
              },
              "localizedValues": {
                "distance": {
                  "text": "37 m"
                },
                "staticDuration": {
                  "text": "1 minute"
                }
              },
              "travelMode": "DRIVE"
            },
            {
              "distanceMeters": 335,
              "staticDuration": "102s",
              "polyline": {
                "encodedPolyline": "}shiHkoeM^o@Zu@n@uARe@FODKL[`@{@h@kAl@qAVi@l@uAXo@JY"
              },
              "startLocation": {
                "latLng": {
                  "latitude": 48.8737523,
                  "longitude": 2.3271007
                }
              },
              "endLocation": {
                "latLng": {
                  "latitude": 48.8718219,
                  "longitude": 2.3306092
                }
              },
              "navigationInstruction": {
                "maneuver": "STRAIGHT",
                "instructions": "Continuer tout droit sur Rue Auber"
              },
              "localizedValues": {
                "distance": {
                  "text": "0,3 km"
                },
                "staticDuration": {
                  "text": "2 minutes"
                }
              },
              "travelMode": "DRIVE"
            },
            {
              "distanceMeters": 152,
              "staticDuration": "56s",
              "polyline": {
                "encodedPolyline": "{ghiHiefMb@PZLjAb@`Bl@TH"
              },
              "startLocation": {
                "latLng": {
                  "latitude": 48.8718219,
                  "longitude": 2.3306092
                }
              },
              "endLocation": {
                "latLng": {
                  "latitude": 48.870517400000004,
                  "longitude": 2.3299908
                }
              },
              "navigationInstruction": {
                "maneuver": "TURN_RIGHT",
                "instructions": "À Place Charles-Garnier, prendre à droite et continuer sur Rue Scribe\nVotre destination se trouvera sur la droite."
              },
              "localizedValues": {
                "distance": {
                  "text": "0,2 km"
                },
                "staticDuration": {
                  "text": "1 minute"
                }
              },
              "travelMode": "DRIVE"
            }
          ],
          "localizedValues": {
            "distance": {
              "text": "33,6 km"
            },
            "duration": {
              "text": "38 minutes"
            },
            "staticDuration": {
              "text": "47 minutes"
            }
          }
        }
      ],
      "distanceMeters": 33571,
      "duration": "2266s",
      "staticDuration": "2815s",
      "polyline": {
        "encodedPolyline": "k`bjH}duNAg@?mAGWGKGgACqD@]HaD?]?C?y@@E?EBi@BUD_A@eA@}@?kA?y@CwAAs@EeA?ECYCa@G}@?EEc@Ee@AEIq@AGAK[uB?CSa@MKOEYCIBMJSh@G^OnBEJ?hAEvC?|@@vBDbBRbDH~@BRHn@Fb@F\\N|ATtCHnAJzB@XHvBDhAB|@?DFxBD|@XzDJnCFlCFbD`@~RP|IN~FFbDAfBQnA_@dAa@j@c@\\y@TSDM@S?_@Dm@B}@HoAF_A@U?q@UmBgAGEoAy@}@kA_@w@W}@ESMsAK}BCm@g@kLASA][eHU}DS_BGg@Ie@YeAMWQSSQu@KmBFO@QBi@H{ALUBaAb@w@z@KLQ^Wr@ETMz@Cx@DdBJ~AZlD`@hFHpD@^JpGJjED|AN~I@b@PjGVnKD~BNpFD~@`@`KRzDLjBDp@TnDDh@z@fMZxE\\lF^`GVjCFt@`@hDtAzKt@zENr@b@hCnA~GBNt@bEt@zDz@fEt@vDLh@`@bBt@tC\\hAd@xAN`@dAnCb@fA@@j@nA`@x@b@z@v@rAt@jAdChDdCpCJH|ClCnBxALP`B`A|B|A^VbD`CrB`BbB~Az@z@b@`@tBtBfCvCxBtCXb@t@`AxAnBbArA~AtB~@jA`@d@x@bAdFlF|DbE|HrJz@bAvAfBdCzCxAbBDFFH`B~AtB~AdBnAbAv@dC|BbBhBf@p@~@lA^h@vAxBr@bATDjApBt@nA`AdBj@`ApAxBhB`DdGhKb@v@JN|@|AR^z@xAlBdDrDnGhCnE`EbHzClFzCjF~@~AxBvDnAtBPZfD|FjCrEtC`Fp@jAn@jAhAjBvBtDtA~BbAfB`EdHzAhCxAfClAtBnAxBpAxBzClFfAjBb@r@l@fA~@`BfAfBfD`GT`@l@bAfCtE`BzCJRhA|Bj@jA\\v@j@lA`AxB@B`LfWnBnEl@tAlApCf@hAn@zAd@bA~@tBvBbF\\v@rAxCz@pB`AvBz@nBVj@h@lAVj@Rf@n@tAp@~At@~AbAzBxAfDx@hBfAfC`@|@|FxMhHdPnAtCnAtC|@rBrAzC~CvHrAnD\\`Ah@`BtB~G`AxD`@~AH\\bA`Fj@xCNt@nAxHNbAJp@x@zFPpAl@~Dd@fDxBrOZxBLz@v@jFn@pEXrB\\~BHl@n@lEL|@zAnKN~@h@vDJx@\\tBHh@l@~D\\~B`@nCbBlLxAbKvAxJNhAv@lFJp@tAxJl@nFb@xE^|EJtAXbF@ZZpIFpCJ`HDnE@bDLzL@`CDdDBbEBvB@ZD|D?p@BxAFvCDfBFvB^lIb@|GBX`@vEPnBVzBp@vFNjAXrBVxAt@hEj@dD|@hFX`B|@dF|@fF~@hFX~A`@`CP~@p@tDVzARhA\\xBNdAJl@x@dGL`Ad@~CJh@Rx@d@xA\\v@NXh@z@`AfAjA|@\\Nv@X`@Fr@Hd@?~@?pBIx@ClCKtAElEOvEOjCK~@Ez@AF?pDMlBGp@AtAGtK]`FOpOi@pI[|GU~EYnMc@hDMl@A~EQz@C\\?tAAH?TAxAGLHz@AD@z@Nf@ZZ`@JRLXJ^PfAB|@?DMfF?P@pALZKxCKhDAr@?`@ApDBtE@hBBpD@p@FlJ@dABxDFdJ@~DHtM@bC@vABtB?v@@^?`A@hCDjE@rCBbDBrD@jDB~BDxGB|D@|ABzDBzD@`DHbL?hBBrD@jA?P@h@B`BFtA?LFt@@TRhBFd@l@dDTfANt@fApFrBbKTjAJh@Px@l@vCh@fCVbA`AnDb@bBJXRx@Nf@n@`CXdAXbA~AvFlDlMbAlCh@nAh@dAjBjDl@hAvAlCTd@BDz@jBAj@Ph@b@jAj@vAj@zAb@~@PXb@k@j@{@JOb@s@FUV_@RYV_@Xc@Zc@^k@X_@~@sAXa@LQHENEJCUo@R[v@kADG^k@DG~@sAj@{@zBcDvAuB^i@LSLSG_A]aGC[Ce@KsDAoB?m@@u@?G?UBg@D{@JgAB[De@@MRiBN{@F]PcA@MNc@f@}AXy@lAiC|@qAd@k@j@o@Z[d@g@z@{@hBkB|B_CxByBXYfEmEP?j@c@BEFQlAe@hAg@r@YtAm@hAg@NIbBq@DC|@a@ZOt@]DChCgA|@]x@c@DAZMJGDAdAc@JGnB{@\\O|@_@XONFP?\\BL?JHMuAOgBAWI_AQuBG{@C_@Ei@Bg@XJf@KFA\\Gf@I~Ba@VCRMj@M^o@Zu@n@uARe@FODKL[`@{@h@kAl@qAVi@l@uAXo@JYb@PZLjAb@`Bl@TH"
      },
      "description": "A1",
      "warnings": [
        "Cet itinéraire emprunte une autoroute."
      ],
      "viewport": {
        "low": {
          "latitude": 48.870517400000004,
          "longitude": 2.3009714
        },
        "high": {
          "latitude": 49.011991599999995,
          "longitude": 2.5800164
        }
      },
      "travelAdvisory": {},
      "localizedValues": {
        "distance": {
          "text": "33,6 km"
        },
        "duration": {
          "text": "38 minutes"
        },
        "staticDuration": {
          "text": "47 minutes"
        }
      },
      "routeToken": "CswDCt8CMtwCGsACCmkCFh-8Ab0H_A2tAvZEz4ECkskCsMUo34wK8ZcCnkaQoIEB_rCoAfzKKNH4jQHawSLK4iCGEKoX5YPAAcWuknCasJtgluy9EOkWqluzpAmUowmDvwnIrgmbt8sBsKnJAcGdA6OlCMj3CAAScByo5Q71iEgQZ7tCfBHxedfPj33u8bfn87Oj8tq7t3iP1tTIR0fRgnXEXuXDvJ-IEWPcXrZ-A1MS3ic2RlUF0SS13zQSY24OXscJKaYmygCAsMfHW4rwTTNxwZZzQV6w75wxwipucd9pXTL6UV2DQKUaKgACAQWFAQABAOEBOoICAgEA_____w84oA3HAQAEDQQH-AEbAgv_____DyocHQADdG4AAgAdBFt2dgB3dmdydG9cEmRjHAAWADIDDgMFPevT-D5FgsqXPkjfqdrUt8P38FMiF2FRNmdaNGlqQ3Y3b2tlUVBvNGp6b0FnEAUaTwpNChgKDQoCCAERAAAAAACAZkAR6Pup8VK-t0ASEggAEAMQBhATEBIYAkIEGgIIBSIbChdhUTZnWl9MOUJfN29rZVFQbzRqem9BZ3ABKAEiFQDSGMi3TskU8O9KH5bOVzPQrTmCmxoYCgoNi2A1HRU-VYgBEgoN3F01HRWAVYgB",
      "routeLabels": [
        "DEFAULT_ROUTE"
      ],
      "polylineDetails": {}
    }
  ],
  "geocodingResults": {}
}
    */


    return {
        geocoded_waypoints: data.geocoded_waypoints,
        routes: data.routes.map(route => {

            const bounds = new google.maps.LatLngBounds()
            route.legs.forEach(leg => {
                bounds.extend(new google.maps.LatLng(leg.startLocation.latLng.latitude, leg.startLocation.latLng.longitude))
                bounds.extend(new google.maps.LatLng(leg.endLocation.latLng.latitude, leg.endLocation.latLng.longitude))
            })

            return ({
                bounds,
                copyrights: route.copyrights,
                warnings: route.warnings,
                overview_path: google.maps.geometry.encoding.decodePath(route.polyline.encodedPolyline),
                legs: route.legs.map(leg => ({
                    distance: leg.localizedValues.distance.text,
                    duration: leg.localizedValues.staticDuration.text,
                    start_address: leg.startLocation.latLng.latitude + ',' + leg.startLocation.latLng.longitude,
                    end_address: leg.endLocation.latLng.latitude + ',' + leg.endLocation.latLng.longitude,
                    steps: leg.navigationSteps.map(step => ({
                        distance: step.localizedValues.distance.text,
                        duration: step.localizedValues.staticDuration.text,
                        start_location: step.startLocation.latLng.latitude + ',' + step.startLocation.latLng.longitude,
                        end_location: step.endLocation.latLng.latitude + ',' + step.endLocation.latLng.longitude,
                        maneuver: step.navigationInstruction.maneuver,
                        instructions: step.navigationInstruction.instructions,
                        polyline: google.maps.geometry.encoding.decodePath(step.polyline.encodedPolyline)
                    }))
                }))

            }) as google.maps.DirectionsResult['routes'][number]
        }),
        request: {
            travelMode: data.routes[0].legs[0].travelMode,
            unitSystem: data.routes[0].legs[0].unitSystem,
            waypoints: data.routes[0].legs[0].waypoints,
            
        },
        available_travel_modes: data.routes[0].legs[0].availableTravelModes
    };
}
